import React from "react";
import { Sidebar, SubSidebar } from "../sidebar";
import { Content } from "../content";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

export const Layout = (props: any) => {
	const router = useRouter();
	const { heading, children } = props;
	return (
		<div
			className="flex justify-start h-screen 
			bg-gray-400 dark:bg-gray-700"
		>
			<Sidebar />
			<SubSidebar />
			<Content heading={heading}>
				<AnimatePresence mode="wait">
					<motion.div
						key={router.pathname}
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
