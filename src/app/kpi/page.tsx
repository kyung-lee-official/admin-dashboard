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
		setSelectedMenu(MenuKey.KPI);
		setSelectedSubMenu(MenuKey.KPI, pathname);
	}, [setSelectedMenu, setSelectedSubMenu]);
	return (
		<div
			className="flex flex-col justify-center items-center gap-20
			pt-20
			font-bold text-neutral-500 dark:text-neutral-500"
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
