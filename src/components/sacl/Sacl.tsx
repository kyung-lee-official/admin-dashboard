"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useSidebarStore } from "@/stores/sidebar";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import ms from "ms";
import { usePathname, useRouter } from "next/navigation";
import { Loading } from "./Loading";
import {
	getIsSeeded,
	getIsSignedIn,
	getTencentCosTempCredential,
	refreshAccessToken,
} from "@/utilities/api/auth";
import { Layout } from "../layout/Layout";
import { getMyInfo } from "@/utilities/api/users";
import { NetworkError } from "./NetworkError";
import { UnknownError } from "./UnknownError";
import { IsFrozen } from "./IsFrozen";
import { VerifyAccount } from "./VerifyAccount";

/**
 * SACL (Seed and Auth Checking Layer) UI
 * @param props
 * @returns
 */
export const Sacl = (props: any) => {
	const pathname = usePathname();
	const { children } = props;
	const router = useRouter();
	const saclRoutes = ["/", "/signin", "/signup", "/seed"];
	const [showChildren, setShowChildren] = useState(false);
	const accessToken = useAuthStore((state) => state.accessToken);
	const setAccessToken = useAuthStore((state) => state.setAccessToken);
	const tencentCosTempCredential = useAuthStore(
		(state) => state.tencentCosTempCredential
	);
	const setTencentCosTempCredential = useAuthStore(
		(state) => state.setTencentCosTempCredential
	);
	const selectedSubMenu = useSidebarStore((state) => state.selectedSubMenu);
	const enableRefetch: boolean = !saclRoutes.includes(pathname);
	const refetchIntervalMs = enableRefetch && 10000;

	const tencentCosTempCredentialQuery = useQuery<any, AxiosError>({
		queryKey: ["tencentCosTempCredential"],
		queryFn: async () => {
			const tempCredential = await getTencentCosTempCredential(
				accessToken
			);
			return tempCredential;
		},
		retry: false,
		refetchOnWindowFocus: false,
		enabled:
			tencentCosTempCredential === null ||
			tencentCosTempCredential?.expiredTime * 1000 - Date.now() < 0,
	});

	useEffect(() => {
		if (tencentCosTempCredentialQuery.isSuccess) {
			setTencentCosTempCredential(tencentCosTempCredentialQuery.data);
		}
	}, [tencentCosTempCredentialQuery]);

	const refreshAccessTokenQuery = useQuery<any, AxiosError>({
		queryKey: ["refreshAccessToken"],
		queryFn: async () => {
			if (accessToken) {
				if (accessToken.split(".")[1]) {
					const tokenPayload = window.atob(accessToken.split(".")[1]);
					const { exp } = JSON.parse(tokenPayload);
					const expirationTime = exp * 1000;
					const now = Date.now();
					if (expirationTime - now > 0) {
						/* Token is not expired yet. */
						const timeLeft = expirationTime - now;
						if (timeLeft < ms("2h")) {
							/* Token is about to expire. */
							const res = await refreshAccessToken(accessToken);
							setAccessToken(res.accessToken);
							return res.accessToken;
						} else {
							/* Ample time left. */
							return null;
						}
					} else {
						/* Token is expired. */
						return null;
					}
				} else {
					return null;
				}
			} else {
				return null;
			}
		},
		refetchInterval: refetchIntervalMs,
	});

	const isSeededQuery = useQuery<any, AxiosError>({
		queryKey: ["isSeeded"],
		queryFn: getIsSeeded,
		retry: false,
		refetchOnWindowFocus: false,
	});

	const isSignedInQuery = useQuery<any, AxiosError>({
		queryKey: ["isSignedIn", accessToken],
		queryFn: async () => {
			const isSignedIn = await getIsSignedIn(accessToken);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
		enabled: isSeededQuery.data?.isSeeded,
		refetchInterval: refetchIntervalMs,
	});

	const myInfoQuery = useQuery<any, AxiosError>({
		queryKey: ["myInfo", accessToken],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(accessToken);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
		enabled: isSignedInQuery.data?.isSignedIn,
		refetchInterval: refetchIntervalMs,
	});

	useEffect(() => {
		if (isSeededQuery.isSuccess) {
			/* Response received */
			if (isSeededQuery.data?.isSeeded) {
				/* Seeded */
				if (isSignedInQuery.isLoading) {
					/* Loading */
				} else if (isSignedInQuery.isError) {
					/* Error */
					if (isSignedInQuery.error.response?.status === 401) {
						/* Unauthorized, not signed in */
						switch (pathname) {
							case "/signin":
								setShowChildren(true);
								break;
							case "/signup":
								setShowChildren(true);
								break;
							default:
								const timer = setTimeout(() => {
									router.push("/signin");
								}, 1500);
								return () => clearTimeout(timer);
								break;
						}
					} else {
						/* Network Error, corresponding UI should be returned */
					}
				} else {
					/* Signed In */
					if (myInfoQuery.isLoading) {
						/* Loading */
					} else {
						if (myInfoQuery.isSuccess) {
							if (myInfoQuery.data.isFrozen) {
								/* Frozen, corresponding UI should be returned */
							} else {
								if (myInfoQuery.data.isVerified) {
									if (saclRoutes.includes(pathname)) {
										router.push("/home");
									} else {
										setShowChildren(true);
									}
								} else {
									/* Not verified, corresponding UI should be returned */
								}
							}
						} else {
							/* Error */
						}
					}
				}
			} else {
				/* Not Seededs */
				if (pathname !== "/seed") {
					const timer = setTimeout(() => {
						router.push("/seed");
					}, 1500);
					return () => clearTimeout(timer);
				} else {
					setShowChildren(true);
				}
			}
		} else {
			/* Loading or no response received */
		}
	}, [
		isSeededQuery.status,
		isSignedInQuery.status,
		myInfoQuery.status,
		pathname,
	]);

	if (isSeededQuery.isError) {
		if (isSeededQuery.error instanceof AxiosError) {
			if (isSeededQuery.error.code === "ERR_NETWORK") {
				return <NetworkError />;
			}
		} else {
			return <UnknownError />;
		}
	}

	if (isSignedInQuery.isError) {
		if (isSignedInQuery.error instanceof AxiosError) {
			if (isSignedInQuery.error.code === "ERR_NETWORK") {
				return <NetworkError />;
			} else {
			}
		} else {
			return <UnknownError />;
		}
	}

	if (myInfoQuery.data?.isFrozen) {
		return <IsFrozen />;
	}

	if (myInfoQuery.data?.isVerified === false) {
		return (
			<VerifyAccount
				myInfo={myInfoQuery.data}
				accessToken={accessToken}
			/>
		);
	}

	/**
	 * Pages are separated into SACL pages and regular pages to support page-switching animations.
	 */
	return (
		<AnimatePresence mode="wait">
			{showChildren ? (
				<motion.div
					key={"regularPages"}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					{saclRoutes.includes(pathname) ? (
						<div className="auth-mask">{children}</div>
					) : (
						<Layout heading={selectedSubMenu?.title}>
							{children}
						</Layout>
					)}
				</motion.div>
			) : (
				<motion.div
					key={"sacl"}
					className="auth-mask"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<Loading hint="Loading" />
				</motion.div>
			)}
		</AnimatePresence>
	);
};
