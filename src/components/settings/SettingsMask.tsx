"use client";

import { motion } from "framer-motion";

export const SettingsMask = (props: any) => {
	const { children } = props;

	return (
		<motion.div
			className="fixed top-0 right-0 bottom-0 left-0
			bg-gray-400
			z-20"
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ type: "tween", duration: 0.2 }}
		>
			{children}
		</motion.div>
	);
};
