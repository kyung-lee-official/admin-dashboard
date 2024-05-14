"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Content } from "../content/Content";
import { Sidebar, SubSidebar } from "../sidebar/Sidebar";

export const Layout = (props: any) => {
	const pathname = usePathname();
	const { heading, children } = props;
	return (
		<div
			className="flex justify-start h-screen 
			bg-neutral-400 dark:bg-neutral-700"
		>
			<Sidebar />
			<SubSidebar />
			<Content heading={heading}>
				<AnimatePresence mode="wait">
					<motion.div
						key={pathname}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{children}
					</motion.div>
				</AnimatePresence>
			</Content>
		</div>
	);
};
