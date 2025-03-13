"use client";

import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "@/utils/api/email";
import { Button } from "@/components/button/Button";

const ContentWrapper = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const verificationToken = searchParams.get("token");
	if (!verificationToken) {
		setTimeout(() => {
			setVerificationState("invalid-token");
		}, 1000);
	}

	const [verificationState, setVerificationState] = useState<
		"verifying" | "invalid-token" | "verification-failed" | "verified"
	>("verifying");

	const isVerifiedQuery = useQuery<any, AxiosError>({
		queryKey: ["isVerified", verificationToken],
		queryFn: async () => {
			const isVerified = await verifyEmail({
				verificationToken: verificationToken as string,
			});
			return isVerified;
		},
		retry: false,
		refetchOnWindowFocus: false,
		enabled: !!verificationToken,
	});

	useEffect(() => {
		if (isVerifiedQuery.isLoading) {
			setVerificationState("verifying");
		} else if (isVerifiedQuery.isError) {
			setVerificationState("verification-failed");
		} else if (isVerifiedQuery.isSuccess) {
			if (isVerifiedQuery.data?.isVerified) {
				setVerificationState("verified");
			} else {
				setVerificationState("verification-failed");
			}
		}
	}, [isVerifiedQuery.status]);

	return (
		<div className="flex justify-center items-center w-full h-svh">
			<AnimatePresence mode="wait">
				{verificationState === "verifying" && (
					<motion.div
						className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6"
						key="verifying"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<h1 className="text-2xl">Verifying... 📃</h1>
					</motion.div>
				)}
				{verificationState === "verified" && (
					<motion.div
						className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6"
						key="verified"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<h1 className="text-2xl">Verified ✅</h1>
						<Button
							size="sm"
							onClick={() => {
								router.push("/sign-in");
							}}
						>
							Go to sign in
						</Button>
					</motion.div>
				)}
				{verificationState === "invalid-token" && (
					<motion.div
						className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6"
						key="invalid-token"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<h1 className="text-2xl">Invalid token ❌</h1>
					</motion.div>
				)}
				{verificationState === "verification-failed" && (
					<motion.div
						className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6"
						key="verification-failed"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<h1 className="text-2xl">Verification failed ❌</h1>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export const Content = () => {
	return (
		<Suspense>
			<ContentWrapper />
		</Suspense>
	);
};
