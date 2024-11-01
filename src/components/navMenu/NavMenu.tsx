"use client";

import React, { ReactNode } from "react";
// import { SubMenuItem, useSidebarStore } from "@/stores/sidebar";
import Link from "next/link";
import { Panel } from "../panel/Panel";
import {
	Crawler,
	Home,
	Manual,
	PerformanceIcon,
	ReturnIcon,
} from "../icons/Icons";
import { ServerMenu } from "../serverMenu/ServerMenu";
import { usePathname } from "next/navigation";
import { flattenMenu, MenuKey } from "@/data/menuItems";

type NavMenuItemProps = {
	menuKey: MenuKey;
	text: string;
	icon?: ReactNode;
};

export const NavMenuItem = ({ menuKey, text, icon }: NavMenuItemProps) => {
	const pathname = usePathname();

	const item = flattenMenu.find((item) => {
		return item.menuKey === menuKey;
	});
	if (item) {
		return (
			<div className="px-3">
				<Link
					href={item.link}
					className={`flex items-center h-7 px-2 gap-2.5
					${pathname === item.link ? "text-neutral-200" : "text-neutral-400/80"}
					${
						pathname === item.link
							? "dark:bg-neutral-400/10"
							: "dark:hover:bg-neutral-400/5"
					}
					rounded-md
					${pathname === item.link && "border-[1px] border-white/10 border-t-white/15"}`}
					title={text}
				>
					<div className="w-5">{icon}</div>
					<div className="min-w-0 text-ellipsis whitespace-nowrap overflow-hidden">
						{text}
					</div>
				</Link>
			</div>
		);
	} else {
		return null;
	}
};

const AppMenu = () => {
	return (
		<>
			<div className="py-3">
				<NavMenuItem
					menuKey={MenuKey.HOME}
					text="Home"
					icon={<Home size="20" />}
				/>
			</div>
			<hr className="border-b-[1px] border-white/5 mx-3 border-dashed" />
			<div className="flex flex-col py-3 gap-1">
				<NavMenuItem
					menuKey={MenuKey.CHITUBOX_DOCS_ANALYTICS}
					text="CHITUBOX Docs Analytics"
					icon={<Manual size="20" />}
				/>
				<NavMenuItem
					menuKey={MenuKey.KPI}
					text="KPI"
					icon={<PerformanceIcon size="20" />}
				/>
				<NavMenuItem
					menuKey={MenuKey.SNS_CRAWLER}
					icon={<Crawler size="20" />}
					text="SNS Crawler"
				/>
			</div>
		</>
	);
};

const SettingsMenu = () => {
	return (
		<>
			<div className="py-3">
				<NavMenuItem
					menuKey={MenuKey.SETTINGS}
					text="Settings"
					icon={<ReturnIcon size="20" />}
				/>
			</div>
			<hr className="border-b-[1px] border-white/5 mx-3 border-dashed" />
			<div className="flex flex-col py-3 gap-1">
				<NavMenuItem
					menuKey={MenuKey.MY_ACCOUNT}
					text="My Account"
					icon={<ReturnIcon size="20" />}
				/>
			</div>
		</>
	);
};

export const NavMenu = () => {
	const pathname = usePathname();

	return (
		<nav
			className="flex flex-col w-56 h-svh
			font-semibold
			border-r-[1px] border-white/5
			z-10"
		>
			<div className="flex-[1_1_52px]">
				<div
					className="flex flex-col
					text-sm text-neutral-400/80"
				>
					{pathname.startsWith("/settings") ? (
						<SettingsMenu />
					) : (
						<AppMenu />
					)}
				</div>
			</div>
			<div className="flex-[0_0_56px]">
				<Panel />
			</div>
		</nav>
	);
};

export default NavMenu;

// export const SubSidebar = () => {
// 	const selectedMenu = useSidebarStore((state) => state.selectedMenu);
// 	const menus = useSidebarStore((state) => state.menus);
// 	const subSidebar = menus.find((menu) => {
// 		return menu.menuKey === selectedMenu;
// 	});

// 	return (
// 		<div
// 			className="flex-none w-60 h-screen
// 			flex flex-col justify-between
// 			bg-neutral-200 dark:bg-neutral-800 text-neutral-500 shadow-lg"
// 		>
// 			<div className="flex-[1_0_auto] flex flex-col">
// 				{subSidebar?.subMenu.map((subMenuItem) => {
// 					if (subMenuItem) {
// 						return (
// 							<SubSidebarTitle
// 								key={subMenuItem.link}
// 								title={subMenuItem.title}
// 								link={subMenuItem.link}
// 							/>
// 						);
// 					} else {
// 						return null;
// 					}
// 				})}
// 			</div>
// 		</div>
// 	);
// };

// export const SubSidebarTitle = (props: SubMenuItem) => {
// 	const { title, link } = props;
// 	const selectedSubMenu = useSidebarStore((state) => state.selectedSubMenu);

// 	if (link === "/home") {
// 		return (
// 			<div
// 				className={`flex items-center justify-between
// 				p-3 m-2 rounded-md
// 				text-neutral-700 bg-neutral-300
// 				dark:text-neutral-300 dark:bg-neutral-600
// 				font-bold text-sm
// 				transition-all duration-100 ease-linear`}
// 			>
// 				<div className="cursor-pointer">{title}</div>
// 				<ServerMenu />
// 			</div>
// 		);
// 	} else {
// 		return (
// 			<Link
// 				href={link}
// 				className={`
// 				p-3 m-2 rounded-md
// 				${
// 					selectedSubMenu?.link === link
// 						? "text-neutral-700 bg-neutral-300 dark:text-neutral-300 dark:bg-neutral-600"
// 						: `text-neutral-500 bg-neutral-200 hover:text-neutral-600 hover:bg-neutral-300/60
// 						dark:text-neutral-500 dark:bg-neutral-800 dark:hover:text-neutral-400 dark:hover:bg-neutral-700`
// 				}
// 				font-bold text-sm overflow-hidden whitespace-nowrap text-ellipsis
// 				transition-all duration-100 ease-linear
// 				cursor-pointer`}
// 			>
// 				{title}
// 			</Link>
// 		);
// 	}
// };
