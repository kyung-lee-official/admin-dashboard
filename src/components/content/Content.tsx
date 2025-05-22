"use client";

import { ReactNode } from "react";
import { HeaderNav } from "../navMenu/HeaderNav";

export const Content = (props: { children: ReactNode }) => {
	const { children } = props;

	return (
		<div className="flex-[1_1_100%] h-svh min-w-0">
			<HeaderNav />
			<div
				className="h-[calc(100svh-56px)]
				scrollbar overflow-y-auto"
			>
				{children}
			</div>
		</div>
	);
};
