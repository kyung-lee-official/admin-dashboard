"use client";

import { ReactNode } from "react";
import { HeaderNav } from "../navMenu/HeaderNav";

export const Content = (props: { children: ReactNode }) => {
	const { children } = props;

	return (
		<div className="flex-[1_1_100%] flex flex-col h-svh">
			<HeaderNav />
			<div className="scrollbar overflow-y-auto">{children}</div>
		</div>
	);
};
