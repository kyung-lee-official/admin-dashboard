"use client";

import { CopyIcon, EditIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import { downloadAvatar, getMyInfo } from "@/utils/api/members";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EditPanel, EditProps } from "../../EditPanel";
import { OneRowSkeleton } from "@/components/skeleton/OneRowSkeleton";
import { queryClient } from "@/utils/react-query/react-query";
import { EditContentAvatar } from "./EditContentAvatar";

const InfoPanel = (props: any) => {
	const { myInfo, jwt } = props;
	const avatarInputRef = useRef<HTMLInputElement>(null);

	const myAvatar = queryClient.getQueryData<any>(["my-avatar", jwt]);

	const onAvatarInputChange = (e: any) => {
		const file = e.target.files[0];
	};

	if (myInfo) {
		return (
			<div
				className="flex flex-col p-4 gap-3
				bg-neutral-300 
				rounded-lg"
			>
				<div className="flex justify-start items-center gap-2 select-none">
					<div className="relative flex justify-center items-center">
						<div
							className="absolute flex justify-center items-center top-0 right-0 bottom-0 left-0
							text-neutral-100 text-sm font-bold
							bg-neutral-500/40 opacity-0 hover:opacity-100
							rounded-full cursor-pointer"
							onClick={() => {
								avatarInputRef.current?.click();
							}}
						>
							CHANGE
							<br />
							AVATAR
						</div>
						{myAvatar ? (
							<div className="w-[88px] h-[88px] border-4 border-neutral-400 rounded-full">
								<img
									src={URL.createObjectURL(myAvatar)}
									alt="avatar"
									className="rounded-full"
								/>
							</div>
						) : (
							<div
								className="flex justify-center items-center w-[88px] h-[88px]
								text-6xl text-neutral-300
								bg-slate-600 border-4 border-neutral-400 rounded-full"
							>
								{myInfo.name[0]}
							</div>
						)}
					</div>
					<div className="p-2 text-neutral-600 font-bold text-xl">
						{myInfo.name}
					</div>
					<EditContentAvatar
						avatarInputRef={avatarInputRef}
						myInfo={myInfo}
						jwt={jwt}
					/>
				</div>
			</div>
		);
	} else {
		return null;
	}
};

export const Content = () => {
	const jwt = useAuthStore((state) => state.jwt);
	const tencentCosTempCredential = useAuthStore(
		(state) => state.tencentCosTempCredential
	);

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
		enabled: !!tencentCosTempCredential && myInfoQuery.isSuccess,
	});

	const [edit, setEdit] = useState<EditProps>({ show: false, id: "" });

	return (
		<div className="flex flex-col w-full max-w-[1600px] p-3 gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				rounded-md border-[1px] border-white/10 border-t-white/15"
			>
				<div className="flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Profile</div>
				</div>
				{/* <InfoPanel myInfo={myInfoQuery.data} jwt={jwt} /> */}
				<table className="text-sm text-white/50 font-semibold">
					<tbody
						className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
						<tr>
							<td className="w-1/2">
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
												src={URL.createObjectURL(
													myAvatarQuery.data
												)}
												className="rounded-full"
											/>
										) : (
											<div>
												{myInfoQuery.data.name[0]}
											</div>
										)
									) : (
										myInfoQuery.data?.name[0]
									)}
								</div>
							</td>
							<td className="w-1/2">
								<div className="w-7 h-7">
									{/* placeholder */}
								</div>
							</td>
							<td>
								<button
									className="flex justify-center items-center w-7 h-7
									text-white/50
									hover:bg-white/10 rounded-md"
									onClick={() => {
										setEdit({ show: true, id: "profile" });
									}}
								>
									<EditIcon size={15} />
								</button>
							</td>
						</tr>
						<tr>
							<td className="w-1/2">Name</td>
							<td className="w-1/2">
								{myInfoQuery.isSuccess ? (
									myInfoQuery.data.name
								) : (
									<OneRowSkeleton />
								)}
							</td>
							<td>
								<button
									className="flex justify-center items-center w-7 h-7
									text-white/50
									hover:bg-white/10 rounded-md"
									onClick={() => {
										setEdit({ show: true, id: "profile" });
									}}
								>
									<EditIcon size={15} />
								</button>
							</td>
						</tr>
						<tr>
							<td>ID</td>
							<td>
								{myInfoQuery.isSuccess ? (
									myInfoQuery.data.id
								) : (
									<OneRowSkeleton />
								)}
							</td>
							<td>
								<div className="w-7 h-7">
									<button
										className="flex justify-center items-center w-7 h-7
										text-white/50
										hover:bg-white/10 rounded-md"
										onClick={() => {
											navigator.clipboard.writeText(
												myInfoQuery.data.id
											);
										}}
									>
										<CopyIcon size={15} />
									</button>
								</div>
							</td>
						</tr>
						<tr>
							<td>Roles</td>
							<td>
								{myInfoQuery.isSuccess ? (
									myInfoQuery.data.memberRoles.map(
										(role: any) => role.name
									)
								) : (
									<OneRowSkeleton />
								)}
							</td>
							<td>
								<div className="w-7 h-7">
									{/* placeholder */}
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div
				className="text-white/90
				bg-white/5
				rounded-md border-[1px] border-white/10 border-t-white/15"
			>
				<div className="flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Security</div>
				</div>
				<table className="text-sm text-white/50 font-semibold">
					<tbody
						className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
						<tr>
							<td className="w-1/2">Email</td>
							<td className="w-1/2">
								{myInfoQuery.isSuccess ? (
									<div className="flex items-center gap-2">
										<div>{myInfoQuery.data.email}</div>
										<div>
											{myInfoQuery.data
												.isVerified ? null : (
												<div className="border-[1px] border-white/20 px-1.5 rounded-md">
													Unverified
												</div>
											)}
										</div>
									</div>
								) : (
									<OneRowSkeleton />
								)}
							</td>
							<td>
								<button
									className="flex justify-center items-center w-7 h-7
									text-white/50
									hover:bg-white/10 rounded-md"
									onClick={() => {
										setEdit({ show: true, id: "email" });
									}}
								>
									<EditIcon size={15} />
								</button>
							</td>
						</tr>
						<tr>
							<td>Change Password</td>
							<td>{/* placeholder */}</td>
							<td>
								<button
									className="flex justify-center items-center w-7 h-7
									text-white/50
									hover:bg-white/10 rounded-md"
									onClick={() => {
										setEdit({
											show: true,
											id: "change-password",
										});
									}}
								>
									<EditIcon size={15} />
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			{createPortal(
				<EditPanel edit={edit} setEdit={setEdit} />,
				document.body
			)}
		</div>
	);
};
