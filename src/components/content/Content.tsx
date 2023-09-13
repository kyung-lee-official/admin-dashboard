"use client";

import React from "react";

export const Content = (props: any) => {
	const { heading, children } = props;
	return (
		<div
			className="flex-auto h-screen
			flex flex-col
			bg-gray-100
			dark:bg-gray-700 dark:text-gray-500"
		>
			<h2
				className="px-6 py-3 text-xl font-bold font-mono
				text-gray-600 dark:text-gray-200
				border-b-2 border-gray-300 dark:border-gray-800"
			>
				{heading}
			</h2>
			<div className="overflow-y-scroll scrollbar">{children}</div>
		</div>
	);
};
