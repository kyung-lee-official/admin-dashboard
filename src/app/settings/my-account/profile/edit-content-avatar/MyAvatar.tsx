import { useAuthStore } from "@/stores/auth";
import { downloadAvatar, getMyInfo } from "@/utils/api/members";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const MyAvatar = () => {
	const jwt = useAuthStore((state) => state.jwt);
	// const tencentCosTempCredential = useAuthStore(
	// 	(state) => state.tencentCosTempCredential
	// );

	const myInfoQuery = useQuery<any, AxiosError>({
		queryKey: ["my-info", jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const myAvatarQuery = useQuery<any, AxiosError>({
		queryKey: ["my-avatar", jwt],
		queryFn: async () => {
			const avatar = await downloadAvatar(myInfoQuery.data.id, jwt);
			return avatar;
		},
		// enabled: !!tencentCosTempCredential && myInfoQuery.isSuccess,
		enabled: myInfoQuery.isSuccess,
	});

	return (
		<div
			className="flex justify-center items-center w-8 h-8
			text-neutral-50 font-bold select-none
			bg-slate-600 rounded-full"
		>
			{myAvatarQuery.isLoading ? (
				myInfoQuery.data?.name[0]
			) : myAvatarQuery.isError ? (
				myInfoQuery.data?.name[0]
			) : myAvatarQuery.isSuccess ? (
				myAvatarQuery.data ? (
					<img
						alt="avatar"
						src={URL.createObjectURL(myAvatarQuery.data)}
						className="rounded-full"
					/>
				) : (
					<div>{myInfoQuery.data.name[0]}</div>
				)
			) : (
				myInfoQuery.data?.name[0]
			)}
		</div>
	);
};
