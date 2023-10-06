"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import { downloadAvatar, getMyInfo } from "@/utilities/api/users";
import { SettingsIcon } from "../icons/Icons";
import { Settings } from "../settings/Settings";
import { SettingsMask } from "../settings/SettingsMask";
import { metaData } from "../settings/userSettings/metaData";

const PanelItems = (props: any) => {
	const { children, onClick } = props;

	return (
		<div
			className="flex justify-between items-center p-2
			hover:bg-gray-300 dark:hover:bg-gray-800
			cursor-pointer rounded-md transition-all duration-300"
			onClick={onClick}
		>
			{children}
		</div>
	);
};

export const Panel = () => {
	const [showUserSettings, setShowUserSettings] = useState<boolean>(false);
	const accessToken = useAuthStore((state) => state.accessToken);
	const tencentCosTempCredential = useAuthStore(
		(state) => state.tencentCosTempCredential
	);

	const myInfoQuery = useQuery<any, AxiosError>({
		queryKey: ["myInfo", accessToken],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(accessToken);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const myAvatarQuery = useQuery<any, AxiosError>({
		queryKey: ["myAvatar", accessToken],
		queryFn: async () => {
			const avatar = await downloadAvatar(
				myInfoQuery.data.id,
				accessToken
			);
			return avatar;
		},
		enabled: !!tencentCosTempCredential && myInfoQuery.isSuccess,
	});

	return (
		<div
			className="flex-none flex justify-between items-center h-[52px] p-2
			text-lg
			bg-gray-300/40 shadow-lg
			dark:bg-gray-900"
		>
			<div className="flex justify-start items-center gap-2">
				<div
					className="flex justify-center items-center w-8 h-8
					text-gray-50 font-bold select-none
					bg-slate-600 rounded-full"
				>
					{myAvatarQuery.isLoading ? (
						myInfoQuery.data?.nickname[0]
					) : myAvatarQuery.isError ? (
						myInfoQuery.data?.nickname[0]
					) : myAvatarQuery.isSuccess ? (
						myAvatarQuery.data ? (
							<img
								alt="avatar"
								src={URL.createObjectURL(myAvatarQuery.data)}
								className="rounded-full"
							/>
						) : (
							<div>{myInfoQuery.data.nickname[0]}</div>
						)
					) : (
						myInfoQuery.data?.nickname[0]
					)}
				</div>
				<div
					className="flex justify-between items-center
					overflow-hidden whitespace-nowrap text-ellipsis
					cursor-pointer"
				>
					{myInfoQuery.data?.nickname}
				</div>
			</div>
			<PanelItems
				onClick={() => {
					setShowUserSettings(true);
				}}
			>
				<div className="hover:rotate-90 duration-300">
					<SettingsIcon size={24} />
				</div>
			</PanelItems>
			<AnimatePresence mode="wait">
				{showUserSettings && (
					<SettingsMask key={"userSettingsMask"}>
						<Settings
							metaData={metaData}
							setShowSettings={setShowUserSettings}
						/>
					</SettingsMask>
				)}
			</AnimatePresence>
		</div>
	);
};
