"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import { downloadAvatar, getMyInfo } from "@/utils/api/members";
import { SettingsIcon } from "../icons/Icons";
import { Settings } from "../settings/Settings";
import { SettingsMask } from "../settings/SettingsMask";
import { metaData } from "../settings/memberSettings/metaData";

export const Panel = () => {
	const [showMemberSettings, setShowMemberSettings] =
		useState<boolean>(false);
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
		queryKey: ["myAvatar", jwt],
		queryFn: async () => {
			const avatar = await downloadAvatar(myInfoQuery.data.id, jwt);
			return avatar;
		},
		enabled: !!tencentCosTempCredential && myInfoQuery.isSuccess,
	});

	return (
		<div
			className="flex-none flex items-center p-3
			text-white/70
			border-t-[1px] dark:border-white/5"
		>
			<div className="flex justify-between items-center w-full px-1 py-0.5">
				<div className="flex items-center gap-3">
					<div
						className="flex justify-center items-center w-6 h-6
						text-neutral-50 font-bold select-none
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
									src={URL.createObjectURL(
										myAvatarQuery.data
									)}
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
				<button
					className="flex justify-between items-center
						hover:bg-neutral-300 dark:hover:bg-neutral-800
						cursor-pointer rounded-md transition-all duration-300"
					onClick={() => {
						setShowMemberSettings(true);
					}}
				>
					<div className="hover:rotate-90 duration-300">
						<SettingsIcon size={20} />
					</div>
				</button>
				<AnimatePresence mode="wait">
					{showMemberSettings && (
						<SettingsMask key={"memberSettingsMask"}>
							<Settings
								metaData={metaData}
								setShowSettings={setShowMemberSettings}
							/>
						</SettingsMask>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};
