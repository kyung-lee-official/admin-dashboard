"use client";

import { queryClient } from "@/utils/react-query/react-query";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import {
	ReactNode,
	useEffect,
	useRef,
	useState,
	MouseEventHandler,
} from "react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { ChangeAvatarDialog } from "./ChangeAvatarDialog";
import { Button } from "@/components/button/Button";
import { SettingsHeading } from "@/components/settings/ContentRegion";
import { ChangeNicknameDialog } from "./ChangeNicknameDialog";
import { ChangeEmailDialog } from "./ChangeEmailDialog";
import { useSpring } from "framer-motion";
import { Copied } from "./Copied";

const Row = (props: {
	children: ReactNode;
	title: string;
	btnText?: string;
	btnOnClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
	const { children, title, btnText, btnOnClick } = props;
	return (
		<div className="flex justify-between items-center">
			<div className="flex flex-col">
				<div className="text-neutral-600 font-bold text-sm select-none">
					{title}
				</div>
				<div
					className="flex gap-6
					text-neutral-600 text-base leading-4"
				>
					<div>{children}</div>
				</div>
			</div>
			{btnText && (
				<Button color="default" onClick={btnOnClick}>
					{btnText}
				</Button>
			)}
		</div>
	);
};

const InfoPanel = (props: any) => {
	const { myInfo, accessToken } = props;
	const avatarInputRef = useRef<HTMLInputElement>(null);
	const copiedRef = useRef<any>(null);

	const myAvatar = queryClient.getQueryData<any>(["myAvatar", accessToken]);

	const [showChangeNicknameDialog, setShowChangeNicknameDialog] =
		useState<boolean>(false);
	const [showChangeEmailDialog, setShowChangeEmailDialog] =
		useState<boolean>(false);

	const onAvatarInputChange = (e: any) => {
		const file = e.target.files[0];
	};

	if (myInfo) {
		return (
			<div
				className="flex flex-col gap-3 
				p-4
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
								{myInfo.nickname[0]}
							</div>
						)}
					</div>
					<div className="p-2 text-neutral-600 font-bold text-xl">
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
					bg-neutral-100
					rounded-lg"
				>
					<Row
						title="NICKNAME"
						btnText="Edit"
						btnOnClick={() => {
							setShowChangeNicknameDialog(true);
						}}
					>
						{myInfo.nickname}
					</Row>
					<Row
						title="MEMBER ID"
						btnText="Copy"
						btnOnClick={() => {
							navigator.clipboard.writeText(myInfo.id);
							copiedRef.current?.trigger();
						}}
					>
						<div className="flex gap-4">
							<div>{myInfo.id}</div>
							<Copied ref={copiedRef} />
						</div>
					</Row>
					<Row
						title="EMAIL"
						btnText="Edit"
						btnOnClick={() => {
							setShowChangeEmailDialog(true);
						}}
					>
						{myInfo.email}
					</Row>
					<Row title="ROLES">
						<div className="flex flex-wrap gap-2">
							{myInfo.memberRoles?.map((role: any) => {
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
										text-neutral-600 font-normal text-base
										bg-neutral-300 rounded"
									>
										{role.name}
									</div>
								);
							})}
						</div>
					</Row>
					<Row title="GROUPS">
						<div className="flex flex-wrap gap-2">
							{myInfo.memberGroups.length > 0 ? (
								myInfo.memberGroups?.map((group: any) => {
									if (group.name === "everyone") {
										return (
											<div
												key={group.id}
												className="px-1
												text-neutral-600 font-normal text-base
												bg-neutral-300 rounded"
											>
												{group.name}
											</div>
										);
									}
									return (
										<div
											key={group.id}
											className="text-neutral-600 font-normal text-base"
										>
											{group.name}
										</div>
									);
								})
							) : (
								<div className="text-neutral-600 font-normal text-base">
									No Groups
								</div>
							)}
						</div>
					</Row>
					<Row title="OWNED GROUPS">
						<div className="flex flex-wrap gap-2">
							{myInfo.ownedGroups.length > 0 ? (
								myInfo.ownedGroups?.map((ownedGroups: any) => {
									return (
										<div
											key={ownedGroups.id}
											className="px-1
											text-neutral-600 font-normal text-base
											bg-neutral-300 rounded"
										>
											{ownedGroups.name}
										</div>
									);
								})
							) : (
								<div className="text-neutral-600 font-normal text-base">
									No Owned Groups
								</div>
							)}
						</div>
					</Row>
					{/* <div className="flex flex-col gap-2">
						<div className="text-neutral-600 font-bold text-sm select-none">
							VERIFICATION
						</div>
						{myInfo.isVerified ? (
							<div
								className="flex 
								text-neutral-600 font-normal text-base"
							>
								<div
									className="flex justify-center items-center px-1 gap-2
									text-neutral-50 bg-lime-500 rounded-md"
								>
									<div>Verified</div>
									<VerifiedIcon size={18} />
								</div>
							</div>
						) : (
							<div
								className="flex gap-4
								text-neutral-600 font-normal text-base"
							>
								<div className="px-2 text-neutral-50 bg-orange-400 rounded-md">
									Unverified
								</div>
							</div>
						)}
					</div> */}
				</div>
				{showChangeNicknameDialog && (
					<ChangeNicknameDialog
						member={myInfo}
						showChangeNicknameDialog={showChangeNicknameDialog}
						setShowChangeNicknameDialog={
							setShowChangeNicknameDialog
						}
					/>
				)}
				{showChangeEmailDialog && (
					<ChangeEmailDialog
						member={myInfo}
						showChangeEmailDialog={showChangeEmailDialog}
						setShowChangeEmailDialog={setShowChangeEmailDialog}
					/>
				)}
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

	return (
		<div className="flex flex-col gap-6">
			<SettingsHeading>My Account</SettingsHeading>
			<InfoPanel myInfo={myInfo} accessToken={accessToken} />
			<Divider />
			<SettingsHeading>Password</SettingsHeading>
			<div>
				<Button
					color="primary"
					onClick={() => {
						setShowChangePasswordDialog(true);
					}}
				>
					Change Password
				</Button>
			</div>
			{showChangePasswordDialog && (
				<ChangePasswordDialog
					memberId={myInfo.id}
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
