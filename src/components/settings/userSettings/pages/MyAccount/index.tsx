"use client";

import { Button, CopyIcon, SettingsHeading, VerifiedIcon } from "@/components";
import { queryClient } from "@/utilities/react-query/react-query";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { ChangeAvatarDialog } from "./ChangeAvatarDialog";
import { useMutation } from "@tanstack/react-query";
import { sendVerificationEmail } from "@/utilities/api/auth";

const InfoPanel = (props: any) => {
	const { myInfo, accessToken } = props;
	const [copyClicked, setCopyClicked] = useState(false);
	const avatarInputRef = useRef<HTMLInputElement>(null);
	const myAvatar = queryClient.getQueryData<any>(["myAvatar", accessToken]);

	useEffect(() => {
		if (copyClicked === true) {
			const timer = setTimeout(() => {
				setCopyClicked(false);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [copyClicked]);

	const sendVerificationEmailMutation = useMutation<
		any,
		AxiosError,
		string | null | undefined
	>({
		mutationKey: ["sendVerificationEmail", accessToken],
		mutationFn: sendVerificationEmail,
	});

	const onAvatarInputChange = (e: any) => {
		const file = e.target.files[0];
	};

	if (myInfo) {
		return (
			<div
				className="flex flex-col gap-3 
				p-4
				bg-gray-300 
				font-mono
				rounded-lg"
			>
				<div className="flex justify-start items-center gap-2 select-none">
					<div className="relative flex justify-center items-center">
						<div
							className="absolute flex justify-center items-center top-0 right-0 bottom-0 left-0
							text-gray-100 text-sm font-bold
							bg-gray-500/40 opacity-0 hover:opacity-100
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
							<div className="w-[88px] h-[88px] border-4 border-gray-400 rounded-full">
								<img
									src={URL.createObjectURL(myAvatar)}
									alt="avatar"
									className="rounded-full"
								/>
							</div>
						) : (
							<div
								className="flex justify-center items-center w-[88px] h-[88px]
								text-6xl text-gray-300
								bg-slate-600 border-4 border-gray-400 rounded-full"
							>
								{myInfo.nickname[0]}
							</div>
						)}
					</div>
					<div className="p-2 text-gray-600 font-bold text-xl">
						{myInfo.nickname}
					</div>
					<ChangeAvatarDialog
						avatarInputRef={avatarInputRef}
						myInfo={myInfo}
						accessToken={accessToken}
					/>
				</div>
				<div
					className="flex flex-col gap-5
					p-4
					bg-gray-100
					rounded-lg"
				>
					<div className="flex flex-col">
						<div className="text-gray-600 font-bold text-sm select-none">
							NICKNAME
						</div>
						<div className="text-gray-600 font-normal text-base">
							{myInfo.nickname}
						</div>
					</div>
					<div className="flex flex-col">
						<div className="text-gray-600 font-bold text-sm select-none">
							USER ID
						</div>
						<div className="flex items-center gap-6 text-gray-600 font-normal text-base">
							<div>{myInfo.id}</div>
							<div
								className="p-1 hover:bg-gray-400 rounded-md cursor-pointer"
								onClick={() => {
									navigator.clipboard.writeText(myInfo.id);
									if (copyClicked === false) {
										setCopyClicked(true);
									}
								}}
							>
								<CopyIcon size={24} />
							</div>
							{
								<AnimatePresence mode="wait">
									{copyClicked && (
										<motion.div
											key="copied"
											className="text-lime-600 font font-semibold"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
										>
											Copyied
										</motion.div>
									)}
								</AnimatePresence>
							}
						</div>
					</div>
					<div className="flex flex-col">
						<div className="text-gray-600 font-bold text-sm select-none">
							EMAIL
						</div>
						<div className="text-gray-600 font-normal text-base">
							{myInfo.email}
						</div>
					</div>
					<div className="flex flex-col">
						<div className="text-gray-600 font-bold text-sm select-none">
							ROLES
						</div>
						<div className="flex flex-wrap gap-2">
							{myInfo.roles?.map((role: any) => {
								if (role.name === "admin") {
									return (
										<div
											key={role.id}
											className="px-1
											text-yellow-500 font-normal text-base
											bg-zinc-800 rounded"
										>
											{role.name}
										</div>
									);
								}
								return (
									<div
										key={role.id}
										className="px-1 
										text-gray-600 font-normal text-base
										bg-gray-300 rounded"
									>
										{role.name}
									</div>
								);
							})}
						</div>
					</div>
					<div className="flex flex-col">
						<div className="text-gray-600 font-bold text-sm select-none">
							GROUPS
						</div>
						<div className="flex flex-wrap gap-2">
							{myInfo.groups.length > 0 ? (
								myInfo.groups?.map((group: any) => {
									if (group.name === "everyone") {
										return (
											<div
												key={group.id}
												className="px-1
												text-gray-600 font-normal text-base
												bg-gray-300 rounded"
											>
												{group.name}
											</div>
										);
									}
									return (
										<div
											key={group.id}
											className="text-gray-600 font-normal text-base"
										>
											{group.name}
										</div>
									);
								})
							) : (
								<div className="text-gray-600 font-normal text-base">
									No Groups
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-col">
						<div className="text-gray-600 font-bold text-sm select-none">
							OWNED GROUPS
						</div>
						<div className="flex flex-wrap gap-2">
							{myInfo.ownedGroups.length > 0 ? (
								myInfo.ownedGroups?.map((ownedGroups: any) => {
									return (
										<div
											key={ownedGroups.id}
											className="px-1
											text-gray-600 font-normal text-base
											bg-gray-300 rounded"
										>
											{ownedGroups.name}
										</div>
									);
								})
							) : (
								<div className="text-gray-600 font-normal text-base">
									No Owned Groups
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<div className="text-gray-600 font-bold text-sm select-none">
							VERIFICATION
						</div>
						{myInfo.isVerified ? (
							<div
								className="flex 
								text-gray-600 font-normal text-base"
							>
								<div
									className="flex justify-center items-center px-2 py-1 gap-2
									text-gray-50 bg-lime-500 rounded-md"
								>
									<div>Verified</div>
									<VerifiedIcon />
								</div>
							</div>
						) : (
							<div
								className="flex gap-4
								text-gray-600 font-normal text-base"
							>
								<div className="px-2 text-gray-50 bg-orange-400 rounded-md">
									Unverified
								</div>
								<button
									className="px-2 w-[220px]
									text-gray-500
									bg-white rounded-md shadow-sm hover:shadow-md"
									onClick={() => {
										sendVerificationEmailMutation.mutate(
											accessToken
										);
									}}
									disabled={
										sendVerificationEmailMutation.isLoading
									}
								>
									{sendVerificationEmailMutation.isLoading ? (
										<div className="text-gray-400 cursor-not-allowed">
											Sending...
										</div>
									) : (
										<div>Send verification email</div>
									)}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	} else {
		return null;
	}
};

const Divider = () => {
	return <div className="w-full h-[1px] my-4 bg-slate-200" />;
};

export const MyAccount = () => {
	const router = useRouter();
	const accessToken = useAuthStore((state) => state.accessToken);
	const setAccessToken = useAuthStore((state) => state.setAccessToken);
	const setTencentCosTempCredential = useAuthStore(
		(state) => state.setTencentCosTempCredential
	);

	const [showChangePasswordDialog, setShowChangePasswordDialog] =
		useState<boolean>(false);

	const myInfo = queryClient.getQueryData<any>(["myInfo", accessToken]);

	const changePasswordDialogRef = useRef<HTMLDialogElement | null>(null);

	return (
		<div className="flex flex-col gap-6">
			<SettingsHeading>My Account</SettingsHeading>
			<InfoPanel myInfo={myInfo} accessToken={accessToken} />
			<Divider />
			<SettingsHeading>Password</SettingsHeading>
			<div>
				<Button
					onClick={() => {
						setShowChangePasswordDialog(true);
					}}
				>
					Change Password
				</Button>
			</div>
			{showChangePasswordDialog && (
				<ChangePasswordDialog
					userId={myInfo.id}
					accessToken={accessToken}
					showChangePasswordDialog={showChangePasswordDialog}
					setShowChangePasswordDialog={setShowChangePasswordDialog}
				/>
			)}
			<Divider />
			<div>
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
