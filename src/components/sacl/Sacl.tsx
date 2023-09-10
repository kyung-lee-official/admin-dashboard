"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { RegularRoutes, SaclContext, SaclRoutes } from ".";
import { Layout } from "../layout";
import { useSidebarStore } from "@/stores/sidebar";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import {
	getIsSeeded,
	getIsSignedIn,
	getTencentCosTempCredential,
	refreshAccessToken,
} from "@/utilities/api/api";
import { useAuthStore } from "@/stores/auth";
import ms from "ms";
import { usePathname } from "next/navigation";

/**
 * SACL (Seed and Auth Checking Layer) UI
 * @param props
 * @returns
 */
export const Sacl = (props: any) => {
	const pathname = usePathname();
	const { children } = props;
	const saclRoutes = ["/", "/signin", "/signup", "/seed"];
	const { setSaclStatus } = useContext(SaclContext);
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

	const refreshAccessTokenQuery = useQuery<any, AxiosError>({
		queryKey: ["refreshAccessToken"],
		queryFn: async () => {
			if (accessToken) {
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
					}
				}
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

	useEffect(() => {
		if (isSeededQuery.isLoading) {
			setSaclStatus("isSeededQuery.isLoading");
		} else if (isSeededQuery.isError) {
			setSaclStatus("isSeededQuery.isError");
		} else {
			if (isSeededQuery.isSuccess) {
				if (isSeededQuery.data.isSeeded) {
					if (isSignedInQuery.isLoading) {
						setSaclStatus("isSignedInQuery.isLoading");
					} else if (isSignedInQuery.isError) {
						if (isSignedInQuery.error?.response?.status === 401) {
							const timer = setTimeout(() => {
								setSaclStatus("isSignedInQuery.unauthorized");
							}, 500);
							return () => clearTimeout(timer);
						} else {
							setSaclStatus("isSignedInQuery.isError");
						}
					} else {
						if (isSignedInQuery.isSuccess) {
							setSaclStatus("isSignedInQuery.isSuccess");
						}
					}
				} else {
					const timer = setTimeout(() => {
						setSaclStatus("isSeededQuery.notSeeded");
					}, 1500);
					return () => clearTimeout(timer);
				}
			}
		}
	}, [isSeededQuery, isSignedInQuery]);

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

	/* Pages are separated into SACL pages and regular pages to support page-switching animations. */
	return (
		<AnimatePresence mode="wait">
			{saclRoutes.includes(pathname) ? (
				<motion.div
					className="auth-mask"
					key={"saclPages"}
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<SaclRoutes>{children}</SaclRoutes>
				</motion.div>
			) : (
				<motion.div
					key={"regularPages"}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<RegularRoutes>
						<Layout heading={selectedSubMenu?.title}>
							{children}
						</Layout>
					</RegularRoutes>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
