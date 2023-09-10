"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { ChevronDownOutline, SettingsIcon } from "../icons";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, SettingsMask } from "../settings";
import { metaData } from "../settings/serverSettings";

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
							metaData={metaData}
							setShowSettings={setShowServerSettings}
						/>
					</SettingsMask>
				)}
			</AnimatePresence>
		</div>
	);
};
