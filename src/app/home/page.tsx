"use client";

// import { MenuKey, useSidebarStore } from "@/stores/sidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
	const pathname = usePathname();
	// const setSelectedMenu = useSidebarStore((state) => state.setSelectedMenu);
	// const setSelectedSubMenu = useSidebarStore(
	// 	(state) => state.setSelectedSubMenu
	// );

	// useEffect(() => {
	// 	setSelectedMenu(MenuKey.HOME);
	// 	setSelectedSubMenu(MenuKey.HOME, pathname);
	// }, [setSelectedMenu, setSelectedSubMenu]);

	return <div>Home</div>;
};

export default Page;
