"use client";

import { motion } from "framer-motion";
import React from "react";

const spring = {
	type: "spring",
	stiffness: 700,
	damping: 30,
};

interface ToggleProps {
	isOn: boolean;
	isAllowed?: boolean;
	onClick: () => void;
}

export const Toggle = (props: ToggleProps) => {
	const { isOn, isAllowed, onClick } = props;
	return (
		<motion.div
			className={`flex 
            ${isOn ? "justify-end" : "justify-start"}
            items-center w-12 h-7 bg-gray-500
            p-1
			shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] rounded-full ${
				isAllowed ? "cursor-pointer" : "cursor-not-allowed"
			}`}
			initial={{ backgroundColor: isOn ? "#22C55E" : "#6B7280" }}
			animate={{ backgroundColor: isOn ? "#22C55E" : "#6B7280" }}
			onClick={isAllowed ? onClick : undefined}
		>
			<motion.div
				layout
				className="w-5 h-5 bg-gray-100 shadow rounded-full"
				transition={spring}
			></motion.div>
		</motion.div>
	);
};
