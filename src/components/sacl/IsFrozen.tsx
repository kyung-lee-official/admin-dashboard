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
			<div className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
				<h1 className="text-2xl">You've been frozen ❄️</h1>
				<div className="flex flex-col items-center gap-6 w-full">
					<div>
						Sorry, your account has been frozen. Please contact the
						administator for more information.
					</div>
					<Button
						size="sm"
						onClick={() => {
							setJwt(null);
							setTencentCosTempCredential(null);
							router.push("/sign-in");
						}}
					>
						Sign Out
					</Button>
				</div>
			</div>
		</AuthMask>
	);
};
