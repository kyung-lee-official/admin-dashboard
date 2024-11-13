"use client";

import { flattenMenu } from "@/components/navMenu/MenuItems";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export const Content = (props: { children: ReactNode }) => {
	const { children } = props;
	const pathname = usePathname();
	const item = flattenMenu.find((item) => {
		return item.pageUrl === pathname;
	});

	return (
		<div className="flex-[1_1_100%] flex flex-col h-svh">
			<h2
				className="flex-[0_0_56px] flex items-center p-3
				text-sm font-semibold dark:text-white/40
				border-b-[1px] dark:border-white/5"
			>
				{item?.title}
			</h2>
			<div className="scrollbar overflow-y-auto">{children}</div>
		</div>
	);
};
