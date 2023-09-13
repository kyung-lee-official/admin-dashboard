"use client";

import { MenuKey, useSidebarStore } from "@/stores/sidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Index = () => {
	const pathname = usePathname();
	const setSelectedMenu = useSidebarStore((state) => state.setSelectedMenu);
	const setSelectedSubMenu = useSidebarStore(
		(state) => state.setSelectedSubMenu
	);

	useEffect(() => {
		setSelectedMenu(MenuKey.CHITUBOX_DOCS_ANALYTICS);
		setSelectedSubMenu(MenuKey.CHITUBOX_DOCS_ANALYTICS, pathname);
	}, [setSelectedMenu, setSelectedSubMenu]);

	return (
		<div
			className="flex flex-col justify-center items-center pt-20 gap-20
			font-bold text-gray-500 dark:text-gray-500"
		>
			<span className="text-4xl">📌 This Page Is Under Planning 📌</span>
			<img
				src="/resultPages/underPlanning.png"
				alt="Under Planning"
				className="opacity-90"
			/>
		</div>
	);
};

export default Index;
