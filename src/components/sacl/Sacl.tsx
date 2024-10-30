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
	getIsSignedIn,
	getTencentCosTempCredential,
	refreshJwt,
} from "@/utils/api/auth";
import { Layout } from "../layout/Layout";
import { getMyInfo } from "@/utils/api/members";
import { NetworkError } from "./NetworkError";
import { UnknownError } from "./UnknownError";
import { IsFrozen } from "./IsFrozen";
import { VerifyAccount } from "./VerifyAccount";
import { AuthMask } from "./AuthMask";
import { getIsSeeded } from "@/utils/api/server-settings";

/**
 * SACL (Seed and Auth Checking Layer) UI
 * @param props
 * @returns
 */
export const Sacl = (props: any) => {
	const pathname = usePathname();
	const { children } = props;
	const router = useRouter();
	const saclRoutes = ["/", "/sign-in", "/signup", "/seed"];
	const [showLoading, setShowLoading] = useState(true);
	const jwt = useAuthStore((state) => state.jwt);
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
			const tempCredential = await getTencentCosTempCredential(jwt);
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

	const refreshJwtQuery = useQuery<any, AxiosError>({
		queryKey: ["refresh-jwt"],
		queryFn: async () => {
			if (jwt) {
				if (jwt.split(".")[1]) {
					const tokenPayload = window.atob(jwt.split(".")[1]);
					const { exp } = JSON.parse(tokenPayload);
					const expirationTime = exp * 1000;
					const now = Date.now();
					if (expirationTime - now > 0) {
						/* Token is not expired yet. */
						const timeLeft = expirationTime - now;
						if (timeLeft < ms("2h")) {
							/* Token is about to expire. */
							const res = await refreshJwt(jwt);
							setAccessToken(res.jwt);
							return res.jwt;
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
		queryKey: ["is-seeded"],
		queryFn: getIsSeeded,
		retry: false,
		refetchOnWindowFocus: false,
	});

	const isSignedInQuery = useQuery<any, AxiosError>({
		queryKey: ["is-signed-in", jwt],
		queryFn: async () => {
			const isSignedIn = await getIsSignedIn(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
		enabled: isSeededQuery.data?.isSeeded,
		refetchInterval: refetchIntervalMs,
	});

	const myInfoQuery = useQuery<any, AxiosError>({
		queryKey: ["my-info", jwt],
		queryFn: async () => {
			console.log(jwt);
			
			const isSignedIn = await getMyInfo(jwt);
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
					if (
						isSignedInQuery.error.response?.status === 400 ||
						isSignedInQuery.error.response?.status === 401
					) {
						/* Unauthorized, not signed in */
						switch (pathname) {
							case "/sign-in":
								setShowLoading(false);
								break;
							case "/signup":
								setShowLoading(false);
								break;
							default:
								const timer = setTimeout(() => {
									router.push("/sign-in");
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
										setShowLoading(false);
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
					setShowLoading(false);
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
		return <VerifyAccount myInfo={myInfoQuery.data} jwt={jwt} />;
	}

	/**
	 * Pages are separated into SACL pages and regular pages to support page-switching animations.
	 */
	return (
		<AnimatePresence mode="wait">
			{showLoading ? (
				<motion.div
					key={"sacl"}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<AuthMask>
						<Loading hint="Loading" />
					</AuthMask>
				</motion.div>
			) : (
				<motion.div
					key={"regularPages"}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					{saclRoutes.includes(pathname) ? (
						<AuthMask>{children}</AuthMask>
					) : (
						<Layout heading={selectedSubMenu?.title}>
							{children}
						</Layout>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
