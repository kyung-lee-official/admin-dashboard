"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { Load } from "../icons/Icons";

type ButtonProps = {
	children?: ReactNode;
	color?:
		| "default"
		| "primary"
		| "secondary"
		| "success"
		| "warning"
		| "danger"
		| "cancel";
	size?: "sm" | "md" | "lg";
	radius?: "none" | "sm" | "md" | "lg" | "full";
	fullWidth?: boolean;
	isDisabled?: boolean;
	isLoading?: boolean;
	className?: string;
};

export const Button = ({
	children,
	color = "default",
	size = "md",
	radius = "md",
	fullWidth = false,
	isDisabled = false,
	isLoading = false,
	className,
	...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) => {
	let btnBgColor: string;
	switch (color) {
		case "default":
			btnBgColor = `text-neutral-600 dark:text-neutral-50
				bg-neutral-300 hover:bg-neutral-300/70 dark:bg-neutral-600 dark:hover:bg-neutral-600/70
				border-[1px] border-white/10 border-t-white/15`;
			break;
		case "primary":
			btnBgColor =
				"bg-blue-500 hover:bg-blue-500/80 dark:bg-blue-600 dark:hover:bg-blue-600/80";
			break;
		case "secondary":
			btnBgColor =
				"bg-purple-500 hover:bg-purple-500/80 dark:bg-purple-600 dark:hover:bg-purple-600/80";
			break;
		case "success":
			btnBgColor = `text-neutral-600 dark:text-neutral-50
				bg-green-500 hover:bg-green-500/80 dark:bg-green-600 dark:hover:bg-green-600/80`;
			break;
		case "warning":
			btnBgColor = `text-neutral-600 dark:text-neutral-50
				bg-yellow-500 hover:bg-yellow-500/80 dark:bg-yellow-500 dark:hover:bg-yellow-500/80`;
			break;
		case "danger":
			btnBgColor =
				"bg-red-500 hover:bg-red-500/80 dark:bg-red-600 dark:hover:bg-red-600/80";
			break;
		case "cancel":
			btnBgColor = `dark:text-neutral-50
				dark:hover:bg-white/5
				border-[1px] border-white/10 border-t-white/15`;
			break;
		default:
			btnBgColor = `text-neutral-600 dark:text-neutral-50
				bg-neutral-300 hover:bg-neutral-300/70 dark:bg-neutral-600 dark:hover:bg-neutral-600/70`;
			break;
	}

	let btnSize: string;
	switch (size) {
		case "sm":
			btnSize = "py-1.5 px-3 text-sm leading-4";
			break;
		case "md":
			btnSize = "py-2 px-4 text-base";
			break;
		case "lg":
			btnSize = "py-3 px-6 text-lg";
			break;
		default:
			btnSize = "py-2 px-4 text-base";
			break;
	}

	let btnRadius: string;
	switch (radius) {
		case "none":
			btnRadius = "rounded-none";
			break;
		case "sm":
			btnRadius = "rounded-sm";
			break;
		case "md":
			btnRadius = "rounded-md";
			break;
		case "lg":
			btnRadius = "rounded-lg";
			break;
		case "full":
			btnRadius = "rounded-full";
			break;
		default:
			btnRadius = "rounded-md";
			break;
	}

	return (
		<button
			className={`flex items-center justify-center
			${btnSize}
			${btnBgColor}
			${btnRadius}
			${fullWidth && "w-full"}
			${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
			${isDisabled ? "bg-neutral-400" : btnBgColor}
			${isDisabled ? "text-neutral-500" : "text-neutral-50"}
			transition-all duration-150 outline-none
			${className}`}
			disabled={isDisabled || isLoading}
			{...rest}
		>
			{isLoading ? <Load size={24} /> : <>{children}</>}
		</button>
	);

	// if (buttonType === "settings") {
	// 	if (isLoading) {
	// 		return (
	// 			<button
	// 				className={`flex justify-center items-center py-1 px-4
	// 				text-neutral-400 bg-neutral-300
	// 				rounded
	// 				cursor-not-allowed
	// 				transition-all duration-150`}
	// 				disabled={disabled}
	// 			>
	// 				<motion.div
	// 					className="text-slate-400"
	// 					initial={{ rotateZ: 0 }}
	// 					animate={{ rotateZ: 360 }}
	// 					transition={{
	// 						repeat: Infinity,
	// 						duration: 1.5,
	// 					}}
	// 				>
	// 					<Load size={"24"} />
	// 				</motion.div>
	// 			</button>
	// 		);
	// 	}

	// 	return (
	// 		<button
	// 			className={`flex justify-center items-center py-1
	// 			px-4
	// 			${disabled ? "text-neutral-400" : "text-neutral-50"}
	// 			${disabled ? "bg-neutral-300" : buttonLevelClass}
	// 			rounded
	// 			${disabled ? "cursor-not-allowed" : "cursor-pointer"}
	// 			transition-all duration-150`}
	// 			disabled={disabled}
	// 			onClick={onClick}
	// 		>
	// 			{children ? children : null}
	// 		</button>
	// 	);
	// } else {
	// 	/* buttonType is "regular" */
	// 	if (isLoading) {
	// 		return (
	// 			<button
	// 				className={`flex justify-center items-center p-2 min-h-[40px]
	// 				px-4
	// 				text-neutral-400 bg-neutral-300
	// 				rounded
	// 				cursor-not-allowed
	// 				transition-all duration-150`}
	// 				disabled={disabled}
	// 			>
	// 				<motion.div
	// 					className="text-slate-400"
	// 					initial={{ rotateZ: 0 }}
	// 					animate={{ rotateZ: 360 }}
	// 					transition={{
	// 						repeat: Infinity,
	// 						duration: 1.5,
	// 					}}
	// 				>
	// 					<Load size={"24"} />
	// 				</motion.div>
	// 			</button>
	// 		);
	// 	}

	// 	return (
	// 		<button
	// 			className={`flex justify-center items-center p-2 min-h-[40px]
	// 			px-4
	// 			${disabled ? "text-neutral-500" : "text-neutral-50 hover:text-neutral-100"}
	// 			${disabled ? "bg-neutral-400" : buttonLevelClass}
	// 			rounded
	// 			${disabled ? "cursor-not-allowed" : "cursor-pointer"}
	// 			transition-all duration-150`}
	// 			disabled={disabled}
	// 			onClick={onClick}
	// 		>
	// 			{children ? children : null}
	// 		</button>
	// 	);
	// }
};
