"use client";

import React from "react";
import Link from "next/link";
import { Panel } from "../panel/Panel";
import { ReturnIcon } from "../icons/Icons";
import { usePathname } from "next/navigation";
import {
	homeMenuItem,
	MenuItem,
	menuItems,
	settingsGeneralMenuItems,
	settingsMyAccountMenuItems,
} from "@/components/navMenu/MenuItems";

export const NavMenuItem = (props: { menu: MenuItem[] }) => {
	const pathname = usePathname();

	const { menu } = props;

	return (
		<div>
			{menu.map((item, i) => {
				const isSubMenuItem =
					item.subMenu &&
					item.subMenu.some((item) => item.link === pathname);

				return (
					<div key={i} className="px-3">
						<Link
							href={item.link}
							className={`flex justify-start items-center h-7 px-2 gap-2.5
							${pathname === item.pageUrl ? "text-neutral-200" : "text-neutral-400/80"}
							${
								pathname === item.pageUrl
									? "dark:bg-neutral-400/10"
									: "dark:hover:bg-neutral-400/5"
							}
							rounded-md
							${
								pathname === item.pageUrl &&
								"border-[1px] border-white/10 border-t-white/15"
							}`}
							title={item.title}
						>
							{item.icon && (
								<div className="flex-[0_0_20px] h-5">
									{item.icon}
								</div>
							)}
							<div className="min-w-0 text-ellipsis whitespace-nowrap overflow-hidden">
								{item.title}
							</div>
						</Link>
						{item.subMenu && isSubMenuItem && (
							<NavSubMenuItem menu={item.subMenu} />
						)}
					</div>
				);
			})}
		</div>
	);
};

const NavSubMenuItem = (props: { menu: MenuItem[] }) => {
	const pathname = usePathname();
	const { menu } = props;

	return (
		<div>
			{menu.map((item, i) => {
				return (
					<Link
						key={i}
						href={item.link}
						className={`flex justify-start items-center h-7 px-2 gap-2.5
						${pathname === item.link ? "text-neutral-200" : "text-neutral-400/50"}
						${
							pathname === item.link
								? "dark:bg-neutral-400/10"
								: "dark:hover:bg-neutral-400/5"
						}
						rounded-md
						${pathname === item.link && "border-[1px] border-white/10 border-t-white/15"}`}
						title={item.title}
					>
						{item.icon ? (
							<div className="flex-[0_0_20px] h-5">
								{item.icon}
							</div>
						) : (
							/* placeholder */
							<div className="flex-[0_0_20px] h-5"></div>
						)}
						<div className="min-w-0 text-ellipsis whitespace-nowrap overflow-hidden">
							{item.title}
						</div>
					</Link>
				);
			})}
		</div>
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
						/* settings menu */
						<>
							<div
								className="py-3
								text-white/90"
							>
								<div className="px-3">
									<Link
										href={"/home"}
										className={`flex items-center h-7 px-2 gap-2.5
										text-neutral-200
										dark:hover:bg-neutral-400/5
										rounded-md`}
										title="Settings"
									>
										<div className="w-5">
											<ReturnIcon size="20" />
										</div>
										<div className="min-w-0 text-ellipsis whitespace-nowrap overflow-hidden">
											Settings
										</div>
									</Link>
								</div>
							</div>
							<hr
								className="mx-3 my-2
								border-dashed border-white/10"
							/>
							<div className="flex flex-col gap-2">
								<div className="flex flex-col gap-2">
									<div className="px-3">
										<div
											className="px-2
											text-white/30"
										>
											General
										</div>
									</div>
									<NavMenuItem
										menu={settingsGeneralMenuItems}
									/>
								</div>
								<hr
									className="mx-3 my-2
									border-dashed border-white/10"
								/>
								<div className="flex flex-col gap-2">
									<div className="px-3">
										<div
											className="px-2
											text-white/30"
										>
											My Account
										</div>
									</div>
									<NavMenuItem
										menu={settingsMyAccountMenuItems}
									/>
								</div>
							</div>
						</>
					) : (
						/* main menu */
						<>
							<div className="py-3">
								<NavMenuItem menu={homeMenuItem} />
							</div>
							<hr
								className="mx-3 my-2
								border-dashed border-white/10"
							/>
							<div className="py-3">
								<NavMenuItem menu={menuItems} />
							</div>
						</>
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
