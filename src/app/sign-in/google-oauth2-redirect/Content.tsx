"use client";

import { Loading } from "@/components/sacl/Loading";
import { useAuthStore } from "@/stores/auth";
import { AxiosError } from "axios";
import Lottie from "lottie-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import lottieFiles from "@/components/lottie-animations/animation_congratulations.json";
import { AuthenticationQK, getIsSignedIn } from "@/utils/api/authentication";

const PanelContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className="relative flex flex-col items-center w-96 px-10 py-6 gap-6
			text-3xl text-neutral-600
			bg-neutral-200
			rounded-3xl shadow-lg"
		>
			{children}
		</div>
	);
};

const ContentWrapper = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const jwt = searchParams.get("jwt");
	const isNewMember =
		searchParams.get("isNewMember") === "true" ? true : false;
	const isSeedMember =
		searchParams.get("isSeedMember") === "true" ? true : false;
	const setJwt = useAuthStore((state) => state.setJwt);

	const isValidToken = useQuery<any, AxiosError>({
		queryKey: [AuthenticationQK.GET_IS_SIGNED_IN],
		queryFn: async () => {
			const isSignedIn = await getIsSignedIn("Bearer " + jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [countDown, setCountDown] = useState<number>(2);
	useEffect(() => {
		if (isValidToken.isSuccess) {
			if (isValidToken.data.isSignedIn) {
				if (!isNewMember) {
					const interval = setInterval(() => {
						if (countDown > 0) {
							setCountDown((countDown) => {
								return countDown - 1;
							});
						} else {
							router.push("/home");
						}
					}, 1000);
					return () => {
						clearInterval(interval);
					};
				}
			}
		}
	}, [isValidToken, jwt, countDown]);

	if (isValidToken.isLoading) {
		return (
			<PanelContainer>
				<div className="text-3xl">
					<Loading hint={"Verifiying"} />
				</div>
				<div className="text-3xl">📃</div>
			</PanelContainer>
		);
	}

	if (isValidToken.isError) {
		if (isValidToken.error.response?.status === 401) {
			return (
				<PanelContainer>
					<div className="text-3xl">Invalid Token</div>
					<div className="text-3xl">❌</div>
				</PanelContainer>
			);
		} else {
			return (
				<PanelContainer>
					<div>Something went wrong</div>
					<div className="text-3xl">❌</div>
				</PanelContainer>
			);
		}
	}

	if (isValidToken.data.isSignedIn) {
		setJwt(jwt);
		if (isNewMember) {
			if (isSeedMember) {
				return (
					<PanelContainer>
						<div className="text-2xl">You&apos;ve signed up as</div>
						<div
							className="px-2 py-1
							text-yellow-500
							bg-zinc-900 rounded-md"
						>
							admin
						</div>
						<div className="text-3xl">🎉🎉🎉</div>
						<div className="text-lg text-neutral-500">
							The initial password has been sent to your email{" "}
							<span className="text-3xl">📨</span>
						</div>
						<button
							onClick={() => {
								router.push(`/home`);
							}}
							className="flex justify-center items-center w-full gap-4 py-2
							text-xl
							bg-neutral-50 hover:bg-neutral-400
							rounded-xl"
						>
							<div>Go to home page</div>
						</button>
						<div className="absolute top-[-80px] right-0 bottom-20 left-0 pointer-events-none">
							<Lottie
								animationData={lottieFiles}
								loop={false}
								autoplay
							/>
						</div>
					</PanelContainer>
				);
			} else {
				return (
					<PanelContainer>
						<div>You&apos;ve Signed In</div>
						<div className="text-3xl">✅</div>
						<div className="text-lg text-neutral-500">
							The initial password has been sent to your email.
						</div>
						<button
							onClick={() => {
								router.push(`/home`);
							}}
							className="flex justify-center items-center w-full gap-4 py-2
							text-xl
							bg-neutral-50 hover:bg-neutral-400
							rounded-xl"
						>
							<div>Go to home page</div>
						</button>
					</PanelContainer>
				);
			}
		} else {
			return (
				<PanelContainer>
					<div>You&apos;ve Signed In</div>
					<div className="text-3xl">✅</div>
					<div className="text-lg text-neutral-500">
						{`You will be redirect to the home page in ${countDown} seconds`}
					</div>
				</PanelContainer>
			);
		}
	}
};

export const Content = () => {
	return (
		<Suspense>
			<ContentWrapper />
		</Suspense>
	);
};
