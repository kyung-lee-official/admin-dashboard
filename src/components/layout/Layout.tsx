"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Content } from "../content/Content";
import { Sidebar } from "../navMenu/NavMenu";

export const Layout = (props: { children: ReactNode }) => {
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
