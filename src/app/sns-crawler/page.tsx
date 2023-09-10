import { MenuKey, useSidebarStore } from "@/stores/sidebar";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Index = () => {
	const router = useRouter();
	const setSelectedMenu = useSidebarStore((state) => state.setSelectedMenu);
	const setSelectedSubMenu = useSidebarStore(
		(state) => state.setSelectedSubMenu
	);

	useEffect(() => {
		setSelectedMenu(MenuKey.SNS_CRAWLER);
		setSelectedSubMenu(MenuKey.SNS_CRAWLER, router.pathname);
	}, [setSelectedMenu, setSelectedSubMenu]);
	return (
		<div
			className="flex flex-col justify-center items-center gap-20
			pt-20
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
