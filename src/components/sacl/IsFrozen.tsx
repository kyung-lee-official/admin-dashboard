import React from "react";
import { Button } from "../button/Button";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";

export const IsFrozen = () => {
	const router = useRouter();
	const setAccessToken = useAuthStore((state) => state.setAccessToken);
	const setTencentCosTempCredential = useAuthStore(
		(state) => state.setTencentCosTempCredential
	);

	return (
		<div className="auth-mask">
			<div
				className="flex flex-col items-center w-[600px] p-10 gap-10
				bg-neutral-200
				rounded-3xl shadow-lg"
			>
				<h1>Account has been frozen ❄️</h1>
				<h2 className="text-lg">
					Sorry, your account has been frozen. Please contact the
					administator for more information.
				</h2>
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
