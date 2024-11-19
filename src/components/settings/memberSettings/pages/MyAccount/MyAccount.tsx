"use client";

import { queryClient } from "@/utils/react-query/react-query";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useRef, useState, MouseEventHandler } from "react";
import { ChangeAvatarDialog } from "./ChangeAvatarDialog";
import { Button } from "@/components/button/Button";
import { SettingsHeading } from "@/components/settings/ContentRegion";
import { Copied } from "./Copied";
import { ChangeNameDialog } from "./ChangeNameDialog";

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
	const { myInfo, jwt } = props;
	const avatarInputRef = useRef<HTMLInputElement>(null);

	const myAvatar = queryClient.getQueryData<any>(["my-avatar", jwt]);

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
								{myInfo.name[0]}
							</div>
						)}
					</div>
					<div className="p-2 text-neutral-600 font-bold text-xl">
						{myInfo.name}
					</div>
					<ChangeAvatarDialog
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

const Divider = () => {
	return <div className="w-full h-[1px] my-4 bg-slate-200" />;
};

export const MyAccount = () => {
	const router = useRouter();
	const jwt = useAuthStore((state) => state.jwt);
	const setJwt = useAuthStore((state) => state.setJwt);
	const setTencentCosTempCredential = useAuthStore(
		(state) => state.setTencentCosTempCredential
	);

	const [showChangePasswordDialog, setShowChangePasswordDialog] =
		useState<boolean>(false);

	const myInfo = queryClient.getQueryData<any>(["my-info", jwt]);

	return (
		<div className="flex flex-col gap-6">
			<SettingsHeading>My Account</SettingsHeading>
			<InfoPanel myInfo={myInfo} jwt={jwt} />
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
			<Divider />
			<div>
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
		</div>
	);
};
