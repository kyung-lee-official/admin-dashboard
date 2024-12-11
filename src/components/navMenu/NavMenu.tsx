"use client";

import Link from "next/link";
import { ReturnIcon } from "../icons/Icons";
import { usePathname } from "next/navigation";
import {
	homeMenuItem,
	HierarchicalMenuItem,
	menuItems,
	settingsGeneralMenuItems,
	settingsMyAccountMenuItems,
	updateIsActive,
} from "@/components/navMenu/MenuItems";
import { MoreMenu } from "./moreMenu/MoreMenu";

function findDescendantActive(m: HierarchicalMenuItem[]): boolean {
	for (const item of m) {
		if (item.isActive) {
			return true;
		}
		if (item.subMenu) {
			const result = findDescendantActive(item.subMenu);
			if (result) {
				return true;
			}
		}
	}
	return false;
}

export const NavMenuItems = (props: { menu: HierarchicalMenuItem[] }) => {
	const { menu } = props;
	updateIsActive(menu);

	return (
		<div>
			{menu.map((item, i) => {
				/* if any of recursive subMenu is active */
				const isDescendantActive = findDescendantActive(
					item.subMenu ?? []
				);
				const isActive = item.isActive;
				if (isDescendantActive) {
					/* has subMenu and one of the subMenu items is active */
					return (
						<div key={i} className="px-3">
							<Link
								href={item.link ?? "/"}
								className="flex justify-start items-center h-7 px-2 gap-2.5
								text-neutral-200"
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
							{item.subMenu &&
								/* has subMenu and one of the subMenu is active */
								item.subMenu.some(
									(subItem) => subItem.isActive
								) && <NavSubMenuItems menu={item.subMenu} />}
						</div>
					);
				} else if (isActive) {
					/* the menu item is active and has no subMenu */
					return (
						<div key={i} className="px-3">
							<Link
								href={item.link ?? "/"}
								className="flex justify-start items-center h-7 px-2 gap-2.5
								text-neutral-200
								bg-neutral-400/10
								border-[1px] border-white/10 border-t-white/15"
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
							{item.subMenu &&
								/* has subMenu and one of the subMenu is active */
								item.subMenu.some(
									(subItem) => subItem.isActive
								) && <NavSubMenuItems menu={item.subMenu} />}
						</div>
					);
				} else {
					/* the menu item is not active and has no subMenu */
					return (
						<div key={i} className="px-3">
							<Link
								href={item.link ?? "/"}
								className="flex justify-start items-center h-7 px-2 gap-2.5
								text-neutral-400/80
								hover:bg-neutral-400/5"
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
							{item.subMenu &&
								/* has subMenu and one of the subMenu is active */
								item.subMenu.some(
									(subItem) => subItem.isActive
								) && <NavSubMenuItems menu={item.subMenu} />}
						</div>
					);
				}
			})}
		</div>
	);
};

const NavSubMenuItems = (props: { menu: HierarchicalMenuItem[] }) => {
	const { menu } = props;

	return (
		<div>
			{menu.map((item, i) => {
				const isDescendantActive = findDescendantActive(
					item.subMenu ?? []
				);
				const isActive = item.isActive;

				return (
					<Link
						key={i}
						href={item.link ?? "/"}
						className={`flex justify-start items-center h-7 px-2 gap-2.5
						${isDescendantActive || isActive ? "text-neutral-200" : "text-neutral-400/50"}
						${
							isDescendantActive || isActive
								? "dark:bg-neutral-400/10"
								: "dark:hover:bg-neutral-400/5"
						}
						rounded-md
						${
							(isDescendantActive || isActive) &&
							"border-[1px] border-white/10 border-t-white/15"
						}`}
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
			className="flex-[0_0_224px] flex flex-col max-w-[224px] h-svh
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
									<NavMenuItems
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
									<NavMenuItems
										menu={settingsMyAccountMenuItems}
									/>
								</div>
							</div>
						</>
					) : (
						/* main menu */
						<>
							<div className="py-3">
								<NavMenuItems menu={homeMenuItem} />
							</div>
							<hr
								className="mx-3 my-2
								border-dashed border-white/10"
							/>
							<div className="py-3">
								<NavMenuItems menu={menuItems} />
							</div>
						</>
					)}
				</div>
			</div>
			<div className="flex-[0_0_56px]">
				<MoreMenu />
			</div>
		</nav>
	);
};
