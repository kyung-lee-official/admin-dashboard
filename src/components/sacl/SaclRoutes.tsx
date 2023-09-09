import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";

export const SaclRoutes = (props: any) => {
	const router = useRouter();
	const { children } = props;
	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				key={router.pathname}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};
