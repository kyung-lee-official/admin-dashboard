"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Content } from "../content/Content";
import { Sidebar, SubSidebar } from "../navMenu/NavMenu";

export const Layout = (props: any) => {
	const pathname = usePathname();
	const { children } = props;
	return (
		<div
			className="flex justify-start h-svh
			dark:bg-neutral-900"
		>
			<Sidebar />
			<Content>{children}</Content>
		</div>
	);
};
