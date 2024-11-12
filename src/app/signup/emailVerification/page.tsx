"use client";

import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "@/utils/api/email";
import { Button } from "@/components/button/Button";

const Index = () => {
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
		<div className="flex justify-center items-center w-full min-h-screen">
			<AnimatePresence mode="wait">
				{verificationState === "verifying" && (
					<motion.div
						className="flex flex-col items-center w-96 px-10 py-6 gap-6
						text-3xl text-neutral-600
						bg-neutral-200
						rounded-3xl shadow-lg"
						key="verifying"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<div className="text-3xl">Verifying...</div>
						<div className="text-3xl">📃</div>
					</motion.div>
				)}
				{verificationState === "verified" && (
					<motion.div
						className="flex flex-col items-center w-96 px-10 py-6 gap-6
						text-3xl text-neutral-600
						bg-neutral-200
						rounded-3xl shadow-lg"
						key="verified"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<div>Verified</div>
						<div>✅</div>
						<Button
							onClick={() => {
								router.push("/sign-in");
							}}
						>
							<div className="flex justify-center items-center py-2">
								Go to sign in
							</div>
						</Button>
					</motion.div>
				)}
				{verificationState === "invalid-token" && (
					<motion.div
						className="flex flex-col items-center w-96 px-10 py-6 gap-6
						text-3xl text-neutral-600
						bg-neutral-200
						rounded-3xl shadow-lg"
						key="invalid-token"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<div>Invalid token</div>
						<div>❌</div>
					</motion.div>
				)}
				{verificationState === "verification-failed" && (
					<motion.div
						className="flex flex-col items-center w-96 px-10 py-6 gap-6
						text-3xl text-neutral-600
						bg-neutral-200
						rounded-3xl shadow-lg"
						key="verification-failed"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<div>Verification failed</div>
						<div>❌</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Index;
