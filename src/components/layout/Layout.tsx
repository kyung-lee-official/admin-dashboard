"use client";

import { ReactNode } from "react";
import { Content } from "../content/Content";
import { NavMenu } from "../navMenu/NavMenu";

export const Layout = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<div
			className="flex justify-start h-svh
			dark:bg-neutral-900"
		>
			<NavMenu />
			<Content>{children}</Content>
		</div>
	);
};
