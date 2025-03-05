import { useAuthStore } from "@/stores/auth";
import { downloadAvatar, getMyInfo, MembersQK } from "@/utils/api/members";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MyInfo } from "../Content";

const AvatarFrame = (props: { children?: React.ReactNode }) => {
	const { children } = props;
	return (
		<div
			className="flex justify-center items-center w-8 h-8
			text-neutral-50 font-bold select-none
			bg-slate-600 rounded-full"
		>
			{children}
		</div>
	);
};

export const MyAvatar = () => {
	const jwt = useAuthStore((state) => state.jwt);
	// const tencentCosTempCredential = useAuthStore(
	// 	(state) => state.tencentCosTempCredential
	// );

	const myInfoQuery = useQuery<MyInfo, AxiosError>({
		queryKey: [MembersQK.GET_MY_INFO, jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const myAvatarQuery = useQuery<any, AxiosError>({
		queryKey: [MembersQK.GET_AVATAR_BY_ID, jwt],
		queryFn: async () => {
			const avatar = await downloadAvatar(myInfoQuery!.data!.id, jwt);
			return avatar;
		},
		// enabled: !!tencentCosTempCredential && myInfoQuery.isSuccess,
		enabled: myInfoQuery.isSuccess,
	});

	if (!myInfoQuery.data) {
		return <AvatarFrame></AvatarFrame>;
	}
	if (myAvatarQuery.isError) {
		return <AvatarFrame>{myInfoQuery.data.name[0]}</AvatarFrame>;
	}
	if (myAvatarQuery.isLoading) {
		return <AvatarFrame>{myInfoQuery.data.name[0]}</AvatarFrame>;
	}
	if (myAvatarQuery.isSuccess) {
		if (myAvatarQuery.data) {
			return (
				<AvatarFrame>
					<img
						alt="avatar"
						src={URL.createObjectURL(myAvatarQuery.data)}
						className="rounded-full"
					/>
				</AvatarFrame>
			);
		} else {
			return <AvatarFrame>{myInfoQuery.data.name[0]}</AvatarFrame>;
		}
	} else {
		return <AvatarFrame>{myInfoQuery.data.name[0]}</AvatarFrame>;
	}
};
