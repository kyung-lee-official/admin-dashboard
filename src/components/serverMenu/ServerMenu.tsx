"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth";
import { getMyInfo } from "@/utils/api/members";
import { uniq } from "@/utils/data/data";
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
            bg-neutral-50
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
	const jwt = useAuthStore((state) => state.jwt);
	const myInfoQuery = useQuery<any, AxiosError>({
		queryKey: ["my-info", jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
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
				const memberManagementIndex = metaDataClone.findIndex(
					(section: any) => section.heading === "MEMBER MANAGEMENT"
				);

				if (!myPermissions.includes(Permissions.UPDATE_MEMBER_ROLE)) {
					metaDataClone[memberManagementIndex].items = metaDataClone[
						memberManagementIndex
					].items.filter((item: any) => item.name !== "Roles");
				}
				if (!myPermissions.includes(Permissions.UPDATE_MEMBER_GROUP)) {
					metaDataClone[memberManagementIndex].items = metaDataClone[
						memberManagementIndex
					].items.filter((item: any) => item.name !== "Groups");
				}
				if (!myPermissions.includes(Permissions.UPDATE_MEMBER)) {
					metaDataClone[memberManagementIndex].items = metaDataClone[
						memberManagementIndex
					].items.filter((item: any) => item.name !== "Members");
				}
			}

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
		<SettingsMask key={"serverSettingsMask"}>
			<Settings
				metaData={filteredMetaData}
				setShowSettings={setShowServerSettings}
			/>
		</SettingsMask>
	);
};
