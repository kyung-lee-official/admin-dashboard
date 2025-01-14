"use client";

import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/button/Button";
import { EmailQK, verifyEmail } from "@/utils/api/email";

type VerificationState =
	| "verifying"
	| "invalid-token"
	| "verification-failed"
	| "verified";

const Panel = (props: { verificationState: VerificationState }) => {
	const { verificationState } = props;
	const router = useRouter();

	switch (verificationState) {
		case "verifying":
			return (
				<motion.div
					className="flex flex-col items-center px-10 py-6 gap-6"
					key="verifying"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
				>
					<h1>Verifying new email...</h1>
				</motion.div>
			);
		case "verified":
			return (
				<motion.div
					className="flex flex-col items-center px-10 py-6 gap-6"
					key="verified"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
				>
					<h1>Verified ✅</h1>
					<Button
						size="sm"
						onClick={() => {
							router.push("/sign-in");
						}}
					>
						Go to sign in
					</Button>
				</motion.div>
			);
		case "invalid-token":
			return (
				<motion.div
					className="flex flex-col items-center px-10 py-6 gap-6"
					key="invalid-token"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
				>
					<h1>Invalid token ❌</h1>
				</motion.div>
			);
		case "verification-failed":
			return (
				<motion.div
					className="flex flex-col items-center px-10 py-6 gap-6"
					key="verification-failed"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
				>
					<div>Verification failed ❌</div>
				</motion.div>
			);
		default:
			break;
	}
};

export const Content = () => {
	const searchParams = useSearchParams();
	const verificationToken = searchParams.get("token");
	if (!verificationToken) {
		setTimeout(() => {
			setVerificationState("invalid-token");
		}, 1000);
	}

	const [verificationState, setVerificationState] =
		useState<VerificationState>("verifying");

	const isNewEmailVerifiedQuery = useQuery<any, AxiosError>({
		queryKey: [EmailQK.IS_NEW_EMAIL_VERIFIED, verificationToken],
		queryFn: async () => {
			const data = await verifyEmail({
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
			setVerificationState("verification-failed");
		} else if (isNewEmailVerifiedQuery.isSuccess) {
			if (isNewEmailVerifiedQuery.data?.isVerified) {
				setVerificationState("verified");
			} else {
				setVerificationState("verification-failed");
			}
		}
	}, [isNewEmailVerifiedQuery.status]);

	return (
		<div
			className="flex justify-center items-center h-svh w-full
			dark:text-neutral-100"
		>
			<AnimatePresence mode="wait">
				<Panel verificationState={verificationState} />
			</AnimatePresence>
		</div>
	);
};
