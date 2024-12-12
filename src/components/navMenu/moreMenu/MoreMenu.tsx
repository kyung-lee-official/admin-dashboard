"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import {
	downloadAvatar,
	getMyInfo,
	MembersQK,
} from "@/utils/api/members";
import { MoreIcon } from "../../icons/Icons";
import { useRouter } from "next/navigation";

export const MoreMenu = () => {
	const router = useRouter();
	const jwt = useAuthStore((state) => state.jwt);
	const setJwt = useAuthStore((state) => state.setJwt);
	const tencentCosTempCredential = useAuthStore(
		(state) => state.tencentCosTempCredential
	);
	const setTencentCosTempCredential = useAuthStore(
		(state) => state.setTencentCosTempCredential
	);

	const entryRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const [show, setShow] = useState<boolean>(false);

	const myInfoQuery = useQuery<any, AxiosError>({
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
			const avatar = await downloadAvatar(myInfoQuery.data.id, jwt);
			return avatar;
		},
		// enabled: !!tencentCosTempCredential && myInfoQuery.isSuccess,
		enabled: myInfoQuery.isSuccess,
	});

	const handleClick = useCallback((e: any) => {
		if (entryRef.current) {
			if (
				e.target === entryRef.current ||
				entryRef.current.contains(e.target)
			) {
				setShow((state) => {
					return !state;
				});
			} else {
				setShow(false);
			}
		}
	}, []);

	useEffect(() => {
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, []);

	return (
		<div
			className="relative flex-none flex items-center p-3
			text-white/90
			border-t-[1px] dark:border-white/5"
		>
			<button
				ref={entryRef}
				className="flex justify-between items-center w-full px-2 py-1
				dark:hover:bg-white/5
				rounded-lg"
			>
				<div className="flex items-center gap-3">
					<div
						className="flex justify-center items-center w-6 h-6
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
									src={URL.createObjectURL(
										myAvatarQuery.data
									)}
									className="rounded-full"
								/>
							) : (
								<div>{myInfoQuery.data.name[0]}</div>
							)
						) : (
							myInfoQuery.data?.name[0]
						)}
					</div>
					<div
						className="flex justify-between items-center
						text-sm font-normal
						overflow-hidden whitespace-nowrap text-ellipsis
						cursor-pointer"
					>
						{myInfoQuery.data?.name}
					</div>
				</div>
				<div className="text-white/40">
					<MoreIcon size={15} />
				</div>
			</button>
			{show && (
				<div
					ref={menuRef}
					className="absolute right-3 bottom-16 left-3
					flex flex-col p-1
					text-sm
					bg-neutral-800
					rounded-lg shadow-lg"
				>
					<button
						className="flex px-2 py-1.5
						hover:bg-neutral-700
						rounded-md"
						onClick={() => {
							router.push("/settings/general/sign-up");
						}}
					>
						Settings
					</button>
					<hr className="-mx-1 my-1 border-white/10" />
					<button
						className="flex px-2 py-1.5
						hover:bg-neutral-700
						rounded-md"
						onClick={() => {
							setJwt("");
							setTencentCosTempCredential("");
							router.push("/sign-in");
						}}
					>
						Sign Out
					</button>
				</div>
			)}
		</div>
	);
};
