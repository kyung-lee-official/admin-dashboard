import React from "react";
import {
	Home,
	Manual,
	Performance,
	Crawler,
	SidebarIcon,
	ServerMenu,
} from "..";
import { MenuKey, SubMenuItem, useSidebarStore } from "@/stores/sidebar";
import Link from "next/link";
import classNames from "classnames";
import { Panel } from "../panel/Panel";

const Divider = () => {
	return <div className="w-[50%] h-[3px] bg-gray-300 rounded-sm" />;
};

export const Sidebar = () => {
	return (
		<div
			className="flex-none w-[4.5rem] h-screen
			flex flex-col items-center
			bg-gray-400 text-secondary shadow-lg
			dark:bg-gray-900
			z-10"
		>
			<SidebarIcon
				icon={<Home size="28" />}
				menuKey={MenuKey.HOME}
				text={"Home"}
			/>
			<Divider />
			<div>
				<SidebarIcon
					icon={<Manual size="28" />}
					menuKey={MenuKey.CHITUBOX_DOCS_ANALYTICS}
					text={"CHITUBOX Docs Analytics"}
				/>
				<SidebarIcon
					icon={<Performance size="28" />}
					menuKey={MenuKey.KPI}
					text={"KPI"}
				/>
				<SidebarIcon
					icon={<Crawler size="28" />}
					menuKey={MenuKey.SNS_CRAWLER}
					text={"SNS Crawler"}
				/>
			</div>
		</div>
	);
};

export const SubSidebar = () => {
	const selectedMenu = useSidebarStore((state) => state.selectedMenu);
	const menus = useSidebarStore((state) => state.menus);
	const subSidebar = menus.find((menu) => {
		return menu.menuKey === selectedMenu;
	});

	return (
		<div
			className="flex-none w-60 h-screen
			flex flex-col justify-between
			bg-gray-200 dark:bg-gray-800 text-gray-500 shadow-lg"
		>
			<div className="flex-[1_0_auto] flex flex-col">
				{subSidebar?.subMenu.map((subMenuItem) => {
					if (subMenuItem) {
						return (
							<SubSidebarTitle
								key={subMenuItem.link}
								title={subMenuItem.title}
								link={subMenuItem.link}
							/>
						);
					} else {
						return null;
					}
				})}
			</div>
			<Panel />
		</div>
	);
};

export const SubSidebarTitle = (props: SubMenuItem) => {
	const { title, link } = props;
	const selectedSubMenu = useSidebarStore((state) => state.selectedSubMenu);
	let activity;
	if (selectedSubMenu?.link === link) {
		activity = classNames(
			"text-gray-700 bg-gray-400 dark:text-gray-300 dark:bg-gray-600"
		);
	} else {
		activity = classNames(
			`text-gray-500 bg-gray-200 hover:text-gray-600 hover:bg-gray-300 
			dark:text-gray-500 dark:bg-gray-800 dark:hover:text-gray-400 dark:hover:bg-gray-700`
		);
	}

	if (link === "/home") {
		return (
			<div
				className={`flex items-center justify-between
				p-3 m-2 rounded-md
				text-gray-700 bg-gray-400 dark:text-gray-300 dark:bg-gray-600
				font-bold text-sm
				transition-all duration-100 ease-linear`}
			>
				<div className="cursor-pointer">{title}</div>
				<ServerMenu />
			</div>
		);
	} else {
		return (
			<Link
				href={link}
				className={`
				p-3 m-2 rounded-md
				${activity}
				font-bold text-sm overflow-hidden whitespace-nowrap text-ellipsis
				transition-all duration-100 ease-linear
				cursor-pointer`}
			>
				{title}
			</Link>
		);
	}
};
