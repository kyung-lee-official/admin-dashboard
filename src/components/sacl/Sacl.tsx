import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import ms from "ms";
import { usePathname, useRouter } from "next/navigation";
import { Loading } from "./Loading";
import {
	AuthenticationQK,
	getIsSignedIn,
	getTencentCosTempCredential,
	refreshJwt,
} from "@/utils/api/authentication";
import { Layout } from "../layout/Layout";
import { getMyInfo, MembersQK } from "@/utils/api/members";
import { NetworkError } from "./NetworkError";
import { UnknownError } from "./UnknownError";
import { IsFrozen } from "./IsFrozen";
import { AuthMask } from "./AuthMask";
import { getIsSeeded, ServerSettingQK } from "@/utils/api/server-settings";
import { MyInfo } from "@/app/settings/my-account/profile/Content";

/**
 * SACL (Seed and Auth Checking Layer) UI
 * @param props
 * @returns
 */
export const Sacl = (props: any) => {
	const { children } = props;
	const pathname = usePathname();
	const router = useRouter();
	const saclRoutes = ["/", "/sign-in", "/sign-up", "/seed"];
	const jwt = useAuthStore((state) => state.jwt);
	// const setJwt = useAuthStore((state) => state.setJwt);
	// const tencentCosTempCredential = useAuthStore(
	// 	(state) => state.tencentCosTempCredential
	// );
	// const setTencentCosTempCredential = useAuthStore(
	// 	(state) => state.setTencentCosTempCredential
	// );
	const enableRefetch: boolean = !saclRoutes.includes(pathname);
	const refetchIntervalMs = enableRefetch && 10000;

	// const tencentCosTempCredentialQuery = useQuery<any, AxiosError>({
	// 	queryKey: [AuthenticationQK.GET_TENCENT_COS_TEMP_CREDENTIAL],
	// 	queryFn: async () => {
	// 		const tempCredential = await getTencentCosTempCredential(jwt);
	// 		return tempCredential;
	// 	},
	// 	retry: false,
	// 	refetchOnWindowFocus: false,
	// 	enabled:
	// 		tencentCosTempCredential === null ||
	// 		tencentCosTempCredential?.expiredTime * 1000 - Date.now() < 0,
	// });

	// useEffect(() => {
	// 	if (tencentCosTempCredentialQuery.isSuccess) {
	// 		setTencentCosTempCredential(tencentCosTempCredentialQuery.data);
	// 	}
	// }, [tencentCosTempCredentialQuery]);

	// const refreshJwtQuery = useQuery<any, AxiosError>({
	// 	queryKey: [AuthenticationQK.REFRESH_JWT],
	// 	queryFn: async () => {
	// 		if (jwt) {
	// 			if (jwt.split(".")[1]) {
	// 				const tokenPayload = window.atob(jwt.split(".")[1]);
	// 				const { exp } = JSON.parse(tokenPayload);
	// 				const expirationTime = exp * 1000;
	// 				const now = Date.now();
	// 				if (expirationTime - now > 0) {
	// 					/* Token is not expired yet. */
	// 					const timeLeft = expirationTime - now;
	// 					if (timeLeft < ms("2h")) {
	// 						/* Token is about to expire. */
	// 						const res = await refreshJwt(jwt);
	// 						setJwt(res.jwt);
	// 						return res.jwt;
	// 					} else {
	// 						/* Ample time left. */
	// 						return null;
	// 					}
	// 				} else {
	// 					/* Token is expired. */
	// 					return null;
	// 				}
	// 			} else {
	// 				return null;
	// 			}
	// 		} else {
	// 			return null;
	// 		}
	// 	},
	// 	refetchInterval: refetchIntervalMs,
	// });

	const isSeededQuery = useQuery<any, AxiosError>({
		queryKey: [ServerSettingQK.IS_SEEDED],
		queryFn: getIsSeeded,
		retry: false,
		refetchOnWindowFocus: false,
	});

	const isSignedInQuery = useQuery<any, AxiosError>({
		queryKey: [AuthenticationQK.GET_IS_SIGNED_IN, jwt],
		queryFn: async () => {
			const isSignedIn = await getIsSignedIn(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
		enabled: !!isSeededQuery.data?.isSeeded,
		refetchInterval: refetchIntervalMs,
	});

	const myInfoQuery = useQuery<MyInfo, AxiosError>({
		queryKey: [MembersQK.GET_MY_INFO, jwt],
		queryFn: async () => {
			const myInfo = await getMyInfo(jwt);
			return myInfo;
		},
		retry: false,
		refetchOnWindowFocus: false,
		enabled: !!isSignedInQuery.data?.isSignedIn,
		refetchInterval: refetchIntervalMs,
	});

	if (isSeededQuery.isPending) {
		/* fetching data, do nothing */
		return <Loading hint="Loading" />;
	}
	if (isSeededQuery.isError) {
		if (isSeededQuery.error instanceof AxiosError) {
			if (isSeededQuery.error.code === "ERR_NETWORK") {
				return <NetworkError />;
			} else {
				return <UnknownError />;
			}
		} else {
			return <UnknownError />;
		}
	}
	if (isSeededQuery.data.isSeeded === false) {
		/* not seeded */
		if (pathname === "/seed") {
			return <AuthMask>{children}</AuthMask>;
		} else {
			const timer = setTimeout(() => {
				router.push("/seed");
			}, 1500);
			return <Loading hint="Loading" />;
		}
	}

	if (isSignedInQuery.isPending) {
		/* fetching data */
		return <Loading hint="Loading" />;
	}
	if (isSignedInQuery.isError) {
		if (isSignedInQuery.error instanceof AxiosError) {
			if (isSignedInQuery.error.code === "ERR_NETWORK") {
				return <NetworkError />;
			}
			if (
				isSignedInQuery.error.response?.status === 400 ||
				isSignedInQuery.error.response?.status === 401
			) {
				/* unauthorized, not signed in */
				switch (pathname) {
					case "/sign-in":
						return <AuthMask>{children}</AuthMask>;
					case "/sign-up":
						return <AuthMask>{children}</AuthMask>;
					default:
						const timer = setTimeout(() => {
							router.push("/sign-in");
						}, 1500);
						return <Loading hint="Loading" />;
				}
			} else {
				/* network error, corresponding UI should be returned */
				return <NetworkError />;
			}
		} else {
			return <UnknownError />;
		}
	}
	/* signed in */
	if (myInfoQuery.isPending) {
		/* loading */
		return <Loading hint="Loading my info" />;
	}

	if (myInfoQuery.isError) {
		if (myInfoQuery.error instanceof AxiosError) {
			if (myInfoQuery.error.code === "ERR_NETWORK") {
				return <NetworkError />;
			} else {
				return <UnknownError />;
			}
		} else {
			return <UnknownError />;
		}
	}

	if (myInfoQuery.data.isFrozen) {
		/* frozen, corresponding UI should be returned */
		return <IsFrozen />;
	} else {
		if (saclRoutes.includes(pathname)) {
			router.push("/home");
			return <Loading hint="Loading" />;
		} else {
			return <Layout>{children}</Layout>;
		}
	}
};
