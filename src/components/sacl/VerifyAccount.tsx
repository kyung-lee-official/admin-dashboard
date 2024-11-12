import { sendVerificationEmail } from "@/utils/api/authentication";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "../button/Button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { AuthMask } from "./AuthMask";

export const VerifyAccount = (props: any) => {
	const { myInfo, jwt } = props;

	const router = useRouter();
	const setJwt = useAuthStore((state) => state.setJwt);
	const setTencentCosTempCredential = useAuthStore(
		(state) => state.setTencentCosTempCredential
	);

	const [emailSent, setEmailSent] = useState<boolean>(false);
	const [allowResendTimestamp, setAllowResendTimestamp] = useState<number>(0);
	const [now, setNow] = useState<number>(Date.now());

	const sendVerificationEmailMutation = useMutation<
		any,
		AxiosError,
		string | null | undefined
	>({
		mutationKey: ["send-verification-email", jwt],
		mutationFn: sendVerificationEmail,
		onSuccess: () => {
			setEmailSent(true);
			setAllowResendTimestamp(Date.now() + 20000);
		},
	});

	useEffect(() => {
		const interval = setInterval(() => {
			setNow(Date.now());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<AuthMask>
			<div
				className="flex flex-col items-center w-[600px] p-10 gap-10
				bg-neutral-200
				rounded-3xl shadow-lg"
			>
				<h1>Verify your account</h1>
				<h2 className="text-lg">
					{emailSent ? (
						"Verification email sent, please check your inbox."
					) : myInfo.name ? (
						<span>
							Hi <strong>{myInfo.name}</strong>, please verify
							your account first.
						</span>
					) : (
						"Hi, please verify your account first."
					)}
				</h2>
				<button
					className="w-fit px-2 py-1
					text-2xl
					bg-white hover:bg-neutral-100 rounded-md shadow-sm"
					onClick={() => {
						sendVerificationEmailMutation.mutate(jwt);
					}}
					disabled={
						sendVerificationEmailMutation.isPending ||
						allowResendTimestamp - now > 0
					}
				>
					{sendVerificationEmailMutation.isPending ? (
						<div className="text-neutral-400 cursor-not-allowed">
							Sending...
						</div>
					) : emailSent ? (
						<div
							className={
								allowResendTimestamp - now > 0
									? "text-neutral-400 cursor-not-allowed"
									: ""
							}
						>
							Resend Email
							{allowResendTimestamp - now > 0 && (
								<span>
									&nbsp; &#40;
									{Math.round(
										(allowResendTimestamp - now) / 1000
									)}
									&#41;
								</span>
							)}
						</div>
					) : (
						<div>Send Verification Email</div>
					)}
				</button>
				<Button
					onClick={() => {
						setJwt(null);
						setTencentCosTempCredential(null);
						router.push("/sign-in");
					}}
				>
					Sign Out
				</Button>
			</div>
		</AuthMask>
	);
};
