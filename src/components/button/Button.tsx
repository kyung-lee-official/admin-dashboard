"use client";

import { motion } from "framer-motion";
import React from "react";
import { Load } from "../icons/Icons";

export type ButtonType = "regular" | "settings";

export type ButtonLevel = "regular" | "danger";

type BaseButtonProps = {
	className?: string;
	buttonType?: ButtonType;
	buttonLevel?: ButtonLevel;
	disabled?: boolean;
	children?: any;
	isLoading?: boolean;
	onClick?: () => any;
};

type NativeButtonProps = BaseButtonProps &
	React.ButtonHTMLAttributes<HTMLElement>;

export const Button: React.FC<NativeButtonProps> = (props) => {
	const {
		children,
		buttonType = "regular",
		buttonLevel = "regular",
		disabled,
		isLoading,
		onClick,
	} = props;

	let buttonLevelClass = "";
	switch (buttonLevel) {
		case "regular":
			buttonLevelClass = "bg-green-500 hover:bg-green-600";
			break;
		case "danger":
			buttonLevelClass = "bg-red-500 hover:bg-red-600";
		default:
			break;
	}

	if (buttonType === "settings") {
		if (isLoading) {
			return (
				<button
					className={`flex justify-center items-center py-1 px-4
					text-neutral-400 bg-neutral-300
					rounded
					cursor-not-allowed
					transition-all duration-150`}
					disabled={disabled}
				>
					<motion.div
						className="text-slate-400"
						initial={{ rotateZ: 0 }}
						animate={{ rotateZ: 360 }}
						transition={{
							repeat: Infinity,
							duration: 1.5,
						}}
					>
						<Load size={"24"} />
					</motion.div>
				</button>
			);
		}

		return (
			<button
				className={`flex justify-center items-center py-1
				px-4
				${disabled ? "text-neutral-400" : "text-neutral-50"}
				${disabled ? "bg-neutral-300" : buttonLevelClass}
				rounded
				${disabled ? "cursor-not-allowed" : "cursor-pointer"}
				transition-all duration-150`}
				disabled={disabled}
				onClick={onClick}
			>
				{children ? children : null}
			</button>
		);
	} else {
		/* buttonType is "regular" */
		if (isLoading) {
			return (
				<button
					className={`flex justify-center items-center min-h-[40px]
					px-4
					text-neutral-400 bg-neutral-300
					rounded
					cursor-not-allowed
					transition-all duration-150`}
					disabled={disabled}
				>
					<motion.div
						className="text-slate-400"
						initial={{ rotateZ: 0 }}
						animate={{ rotateZ: 360 }}
						transition={{
							repeat: Infinity,
							duration: 1.5,
						}}
					>
						<Load size={"24"} />
					</motion.div>
				</button>
			);
		}

		return (
			<button
				className={`flex justify-center items-center min-h-[40px]
				px-4
				${disabled ? "text-neutral-500" : "text-neutral-50 hover:text-neutral-100"}
				${disabled ? "bg-neutral-400" : buttonLevelClass}
				rounded
				${disabled ? "cursor-not-allowed" : "cursor-pointer"}
				transition-all duration-150`}
				disabled={disabled}
				onClick={onClick}
			>
				{children ? children : null}
			</button>
		);
	}
};
