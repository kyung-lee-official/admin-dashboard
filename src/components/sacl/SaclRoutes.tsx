import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

export const SaclRoutes = (props: any) => {
	const pathname = usePathname();
	const { children } = props;
	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				key={pathname}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};
