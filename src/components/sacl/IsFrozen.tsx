import React from "react";
import { Button } from "../button/Button";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { AuthMask } from "./AuthMask";

export const IsFrozen = () => {
	const router = useRouter();
	const setJwt = useAuthStore((state) => state.setJwt);
	const setTencentCosTempCredential = useAuthStore(
		(state) => state.setTencentCosTempCredential
	);

	return (
		<AuthMask>
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
