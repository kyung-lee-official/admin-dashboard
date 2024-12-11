"use client";

import { HierarchicalMenuItem, menu } from "@/components/navMenu/MenuItems";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { HeaderNav } from "../navMenu/HeaderNav";

export const Content = (props: { children: ReactNode }) => {
	const { children } = props;
	const pathname = usePathname();

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

	return (
		<div className="flex-[1_1_100%] flex flex-col h-svh">
			<HeaderNav item={item} />
			<div className="scrollbar overflow-y-auto">{children}</div>
		</div>
	);
};
