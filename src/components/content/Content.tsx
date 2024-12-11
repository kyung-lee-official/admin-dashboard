"use client";

import {
	HierarchicalMenuItem,
	menu,
	MenuKey,
} from "@/components/navMenu/MenuItems";
import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";

export const Content = (props: { children: ReactNode }) => {
	const { children } = props;
	const pathname = usePathname();
	const params = useParams();
	const { statId, sectionId, eventId } = params;

	function recursiveFind(
		menu: HierarchicalMenuItem[]
	): HierarchicalMenuItem | undefined {
		for (const item of menu) {
			if (item.pageUrlReg) {
				if (item.pageUrlReg.test(pathname)) {
					return item;
				}
			}
			if (item.subMenu) {
				const result = recursiveFind(item.subMenu);
				if (result) {
					return result;
				}
			}
		}
	}

	const item = recursiveFind(menu);

	if (item?.breadcrumbs) {
		switch (item.menuKey) {
			case MenuKey.PERFORMANCE_STAT:
				return (
					<div className="flex-[1_1_100%] flex flex-col h-svh">
						<h2
							className="flex-[0_0_56px] flex items-center p-3
							text-sm font-semibold dark:text-white/40
							border-b-[1px] dark:border-white/5"
						>
							<item.breadcrumbs statId={statId} />
						</h2>
						<div className="scrollbar overflow-y-auto">
							{children}
						</div>
					</div>
				);
			default:
				break;
		}
	}

	return (
		<div className="flex-[1_1_100%] flex flex-col h-svh">
			<nav
				className="flex-[0_0_56px] flex items-center p-3
				text-sm font-semibold dark:text-white/40
				border-b-[1px] dark:border-white/5"
			>
				{item?.title}
			</nav>
			<div className="scrollbar overflow-y-auto">{children}</div>
		</div>
	);
};
