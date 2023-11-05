import { sendVerificationEmail } from "@/utilities/api/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "../button/Button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";

export const VerifyAccount = (props: any) => {
	const { myInfo, accessToken } = props;

	const router = useRouter();
	const setAccessToken = useAuthStore((state) => state.setAccessToken);
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
		mutationKey: ["sendVerificationEmail", accessToken],
		mutationFn: sendVerificationEmail,
		onSuccess: () => {
			setEmailSent(true);
			setAllowResendTimestamp(Date.now() + 20000);
		},
	});

	useEffect(() => {
		console.log(myInfo);

		const interval = setInterval(() => {
			setNow(Date.now());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="auth-mask">
			<div
				className="flex flex-col items-center w-[600px] p-10 gap-10
				bg-gray-200
				rounded-3xl shadow-lg"
			>
				<h1>Verify your account</h1>
				<h2 className="text-lg">
					{emailSent ? (
						"Verification email sent, please check your inbox."
					) : myInfo.nickname ? (
						<span>
							Hi <strong>{myInfo.nickname}</strong>, please verify
							your account first.
						</span>
					) : (
						"Hi, please verify your account first."
					)}
				</h2>
				<button
					className="w-fit px-2 py-1
					text-2xl
					bg-white hover:bg-gray-100 rounded-md shadow-sm"
					onClick={() => {
						sendVerificationEmailMutation.mutate(accessToken);
					}}
					disabled={
						sendVerificationEmailMutation.isPending ||
						allowResendTimestamp - now > 0
					}
				>
					{sendVerificationEmailMutation.isPending ? (
						<div className="text-gray-400 cursor-not-allowed">
							Sending...
						</div>
					) : emailSent ? (
						<div
							className={
								allowResendTimestamp - now > 0
									? "text-gray-400 cursor-not-allowed"
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
						setAccessToken(null);
						setTencentCosTempCredential(null);
						router.push("/signin");
					}}
				>
					Sign Out
				</Button>
			</div>
		</div>
	);
};
