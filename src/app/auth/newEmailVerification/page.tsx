"use client";

import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { verifyNewEmail } from "@/utilities/api/auth";
import { Button } from "@/components/button/Button";

const Page = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const verificationToken = searchParams.get("token");
	if (!verificationToken) {
		setTimeout(() => {
			setVerificationState("invalid-token");
		}, 1000);
	}

	const [verificationState, setVerificationState] = useState<
		"verifying" | "invalid-token" | "varification-failed" | "verified"
	>("verifying");

	const isNewEmailVerifiedQuery = useQuery<any, AxiosError>({
		queryKey: ["isNewEmailVerified", verificationToken],
		queryFn: async () => {
			const data = await verifyNewEmail({
				verificationToken: verificationToken as string,
			});
			return data;
		},
		retry: false,
		refetchOnWindowFocus: false,
		enabled: !!verificationToken,
	});

	useEffect(() => {
		if (isNewEmailVerifiedQuery.isLoading) {
			setVerificationState("verifying");
		} else if (isNewEmailVerifiedQuery.isError) {
			setVerificationState("varification-failed");
		} else if (isNewEmailVerifiedQuery.isSuccess) {
			if (isNewEmailVerifiedQuery.data?.isVerified) {
				setVerificationState("verified");
			} else {
				setVerificationState("varification-failed");
			}
		}
	}, [isNewEmailVerifiedQuery.status]);

	return (
		<div className="flex justify-center items-center w-full min-h-screen">
			<AnimatePresence mode="wait">
				{verificationState === "verifying" && (
					<motion.div
						className="flex flex-col items-center w-96 px-10 py-6 gap-6
						text-3xl text-gray-600
						bg-gray-200
						rounded-3xl shadow-lg"
						key="verifying"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<div className="text-3xl">Verifying new email...</div>
						<div className="text-3xl">📃</div>
					</motion.div>
				)}
				{verificationState === "verified" && (
					<motion.div
						className="flex flex-col items-center w-96 px-10 py-6 gap-6
						text-3xl text-gray-600
						bg-gray-200
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
								router.push("/signin");
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
						text-3xl text-gray-600
						bg-gray-200
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
				{verificationState === "varification-failed" && (
					<motion.div
						className="flex flex-col items-center w-96 px-10 py-6 gap-6
						text-3xl text-gray-600
						bg-gray-200
						rounded-3xl shadow-lg"
						key="varification-failed"
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

export default Page;
