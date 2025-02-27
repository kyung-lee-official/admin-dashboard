"use client";

import Link from "next/link";
import { ReturnIcon } from "../icons/Icons";
import { useParams, usePathname } from "next/navigation";
import {
	homeMenuItem,
	HierarchicalMenuItem,
	menuItems,
	settingsGeneralMenuItems,
	settingsMyAccountMenuItems,
} from "@/components/navMenu/MenuItems";
import { MoreMenu } from "./moreMenu/MoreMenu";

export const NavMenuItems = (props: { menu: HierarchicalMenuItem[] }) => {
	const { menu } = props;
	const pathname = usePathname();
	const params = useParams();
	const { statId, sectionId, eventId, templateId, taskId } = params;

	return (
		<div>
			{menu.map((item, i) => {
				const fuzzySource = item.pageUrlReg.source.replace(/\$$/g, "");
				const fuzzyRegex = new RegExp(
					fuzzySource,
					item.pageUrlReg.flags
				);
				const isActive = fuzzyRegex.test(pathname);

				const crumbs = item.breadcrumbs({
					statId,
					sectionId,
					eventId,
					templateId,
					taskId,
				});
				return (
					<div key={i} className="px-3">
						<Link
							href={crumbs[0].href}
							className={`flex justify-start items-center h-7 px-2 gap-2.5
							${isActive ? "text-white/80" : "text-white/50 hover:text-white/60"}`}
							title={crumbs[0].text}
						>
							{item.icon && (
								<div className="flex-[0_0_20px] h-5">
									{item.icon}
								</div>
							)}
							<div className="min-w-0 text-ellipsis whitespace-nowrap overflow-hidden">
								{crumbs[0].text}
							</div>
						</Link>
						{item.subMenu && (
							<div className="flex flex-col gap-2">
								<NavSubMenuItems menu={item.subMenu} />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

const NavSubMenuItems = (props: { menu: HierarchicalMenuItem[] }) => {
	const pathname = usePathname();
	const params = useParams();
	const { statId, sectionId, eventId, templateId, taskId } = params;
	const { menu } = props;

	return (
		<div>
			{menu.map((item, i) => {
				const fuzzySource = item.pageUrlReg.source.replace(/\$$/g, "");
				const fuzzyRegex = new RegExp(
					fuzzySource,
					item.pageUrlReg.flags
				);
				const isActive = fuzzyRegex.test(pathname);

				const crumbs = item.breadcrumbs({
					statId,
					sectionId,
					eventId,
					templateId,
					taskId,
				});
				return (
					<Link
						key={i}
						href={crumbs[1].href}
						className={`flex justify-start items-center h-7 px-2 gap-2.5
						${isActive ? "text-neutral-200" : "text-neutral-400/50"}
						${isActive ? "dark:bg-neutral-400/10" : "dark:hover:bg-neutral-400/5"}
						rounded-md
						${isActive && "border-[1px] border-white/10 border-t-white/15"}`}
						title={crumbs[1].text}
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
							{crumbs[1].text}
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
