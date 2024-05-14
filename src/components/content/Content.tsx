"use client";

import React from "react";

export const Content = (props: any) => {
	const { heading, children } = props;
	return (
		<div
			className="flex-auto h-screen
			flex flex-col
			bg-neutral-100
			dark:bg-neutral-700 dark:text-neutral-500"
		>
			<h2
				className="px-6 py-3
				text-xl font-bold
				text-neutral-600 dark:text-neutral-200
				border-b-2 border-neutral-300 dark:border-neutral-800"
			>
				{heading}
			</h2>
			<div className="overflow-y-scroll scrollbar">{children}</div>
		</div>
	);
};
