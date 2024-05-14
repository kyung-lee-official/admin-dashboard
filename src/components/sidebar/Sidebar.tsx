"use client";

import React from "react";

import { MenuKey, SubMenuItem, useSidebarStore } from "@/stores/sidebar";
import Link from "next/link";
import { Panel } from "../panel/Panel";
import {
	Crawler,
	Home,
	Manual,
	PerformanceIcon,
	SidebarIcon,
} from "../icons/Icons";
import { ServerMenu } from "../serverMenu/ServerMenu";

const Divider = () => {
	return <div className="w-[50%] h-[3px] bg-neutral-400/50 rounded-sm" />;
};

export const Sidebar = () => {
	return (
		<div
			className="flex-none w-[4.5rem] h-screen
			flex flex-col items-center
			bg-neutral-300 text-secondary shadow-lg
			dark:bg-neutral-900
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
					icon={<PerformanceIcon size="28" />}
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
			bg-neutral-200 dark:bg-neutral-800 text-neutral-500 shadow-lg"
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

	if (link === "/home") {
		return (
			<div
				className={`flex items-center justify-between
				p-3 m-2 rounded-md
				text-neutral-700 bg-neutral-300 
				dark:text-neutral-300 dark:bg-neutral-600
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
				${
					selectedSubMenu?.link === link
						? "text-neutral-700 bg-neutral-300 dark:text-neutral-300 dark:bg-neutral-600"
						: `text-neutral-500 bg-neutral-200 hover:text-neutral-600 hover:bg-neutral-300/60
						dark:text-neutral-500 dark:bg-neutral-800 dark:hover:text-neutral-400 dark:hover:bg-neutral-700`
				}
				font-bold text-sm overflow-hidden whitespace-nowrap text-ellipsis
				transition-all duration-100 ease-linear
				cursor-pointer`}
			>
				{title}
			</Link>
		);
	}
};
