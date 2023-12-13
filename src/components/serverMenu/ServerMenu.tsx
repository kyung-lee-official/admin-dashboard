"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth";
import { getMyInfo } from "@/utilities/api/users";
import { uniq } from "@/utilities/data/data";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Permissions } from "../sacl/Permissions";
import { SettingsIcon, ChevronDownOutline } from "../icons/Icons";
import { Settings } from "../settings/Settings";
import { SettingsMask } from "../settings/SettingsMask";
import { metaData } from "../settings/serverSettings/metaData";

export const ServerMenuItem = (props: any) => {
	const { children, onClick } = props;
	return (
		<div
			className="flex justify-between items-center w-full h-10"
			onClick={onClick}
		>
			{children}
		</div>
	);
};

const MenuContent = forwardRef<HTMLDivElement, any>(function MenuContent(
	props,
	ref
) {
	const { setShowServerSettings } = props;
	return (
		<motion.div
			ref={ref}
			className="absolute top-8 right-0
            flex flex-col justify-center items-center gap-1 w-52
            bg-gray-50
            px-4 py-1
            rounded-md shadow-md
            origin-top
            cursor-pointer"
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
		>
			<ServerMenuItem
				onClick={() => {
					setShowServerSettings(true);
				}}
			>
				<div className="pointer-events-none">Server Settings</div>
				<div className="pointer-events-none">
					<SettingsIcon size={18} />
				</div>
			</ServerMenuItem>
		</motion.div>
	);
});

export const ServerMenu = () => {
	const accessToken = useAuthStore((state) => state.accessToken);
	const myInfoQuery = useQuery<any, AxiosError>({
		queryKey: ["myInfo", accessToken],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(accessToken);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [filteredMetaData, setFilteredMetaData] = useState<any>([]);

	useEffect(() => {
		if (myInfoQuery.data) {
			const roles = myInfoQuery.data.memberRoles;
			let metaDataClone: any = JSON.parse(JSON.stringify(metaData));

			const myPermissions = uniq(
				roles.map((role: any) => role.permissions).flat()
			);

			if (
				!myPermissions.includes(
					Permissions.UPDATE_MEMBER_SERVER_SETTING
				)
			) {
				const serverSettingsIndex = metaDataClone.findIndex(
					(section: any) => section.heading === "SERVER SETTINGS"
				);
				metaDataClone[serverSettingsIndex].items = metaDataClone[
					serverSettingsIndex
				].items.filter((item: any) => item.name !== "Server");
			}
			if (
				!(
					myPermissions.includes(Permissions.UPDATE_MEMBER_ROLE) &&
					myPermissions.includes(Permissions.UPDATE_MEMBER_GROUP) &&
					myPermissions.includes(Permissions.UPDATE_MEMBER)
				)
			) {
				const userManagementIndex = metaDataClone.findIndex(
					(section: any) => section.heading === "USER MANAGEMENT"
				);

				if (!myPermissions.includes(Permissions.UPDATE_MEMBER_ROLE)) {
					metaDataClone[userManagementIndex].items = metaDataClone[
						userManagementIndex
					].items.filter((item: any) => item.name !== "Roles");
				}
				if (!myPermissions.includes(Permissions.UPDATE_MEMBER_GROUP)) {
					metaDataClone[userManagementIndex].items = metaDataClone[
						userManagementIndex
					].items.filter((item: any) => item.name !== "Groups");
				}
				if (!myPermissions.includes(Permissions.UPDATE_MEMBER)) {
					metaDataClone[userManagementIndex].items = metaDataClone[
						userManagementIndex
					].items.filter((item: any) => item.name !== "Members");
				}
			}

			metaDataClone = metaDataClone.filter((section: any) => {
				return section.items.length > 0;
			});
			setFilteredMetaData(metaDataClone);
		}
	}, [myInfoQuery.data]);

	const [showMenu, setShowMenu] = useState<boolean>(false);
	const menuContentRef = useRef<HTMLDivElement>(null);
	const [showServerSettings, setShowServerSettings] =
		useState<boolean>(false);

	function onClick() {
		setShowMenu(!showMenu);
	}

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (
				menuContentRef.current &&
				!menuContentRef.current.contains(event.target) &&
				!event.target.classList.contains("home-drop-down-menu")
			) {
				setShowMenu(false);
			}
		}
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [menuContentRef]);

	return (
		<div className="relative">
			<motion.div
				className="home-drop-down-menu cursor-pointer"
				onClick={onClick}
				animate={{ rotateZ: showMenu ? -180 : 0 }}
			>
				<ChevronDownOutline size={24} />
			</motion.div>
			{showMenu && (
				<MenuContent
					ref={menuContentRef}
					setShowServerSettings={setShowServerSettings}
				/>
			)}
			<AnimatePresence mode="wait">
				{showServerSettings && (
					<SettingsMask key={"serverSettingsMask"}>
						<Settings
							metaData={filteredMetaData}
							setShowSettings={setShowServerSettings}
						/>
					</SettingsMask>
				)}
			</AnimatePresence>
		</div>
	);
};
