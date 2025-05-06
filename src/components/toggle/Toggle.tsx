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
	width?: number;
	isAllowed?: boolean;
	onClick: () => void;
}

export const Toggle = (props: ToggleProps) => {
	const { isOn, width = 36, isAllowed, onClick } = props;

	/* Dimensions (proportional values) */
	/* Width of the toggle (in percentage or relative units) */
	const toggleWidth = width;
	/* Height of the toggle */
	const toggleHeight = toggleWidth / 2;
	/* Slider diameter is 80% of the toggle height */
	const sliderDiameter = toggleHeight * 0.8;
	/* Padding is 10% of the toggle height */
	const padding = toggleHeight * 0.1;
	/* Max translation for the slider */
	const maxTranslateX = toggleWidth - sliderDiameter - 2 * padding;

	return (
		<svg
			width={`${toggleWidth}px`}
			height={`${toggleHeight}px`}
			viewBox={`0 0 ${toggleWidth} ${toggleHeight}`}
			xmlns="http://www.w3.org/2000/svg"
			className={`cursor-pointer ${
				isAllowed ? "cursor-pointer" : "cursor-not-allowed"
			}`}
			onClick={isAllowed ? onClick : undefined}
		>
			{/* Background */}
			<motion.rect
				x={0}
				y={0}
				width={toggleWidth}
				height={toggleHeight}
				/* Rounded corners */
				rx={toggleHeight / 2}
				/* Dynamic background color */
				fill={isOn ? "#22C55E" : "#6B7280"}
				transition={spring}
			/>

			{/* Slider */}
			<motion.circle
				/* Start position */
				cx={sliderDiameter / 2 + padding}
				/* Center vertically */
				cy={toggleHeight / 2}
				/* Radius of the slider */
				r={sliderDiameter / 2}
				/* Slider color */
				fill="#FFFFFF"
				animate={{
					/* Animate horizontally */
					x: isOn ? maxTranslateX : 0,
				}}
				transition={spring}
			/>
		</svg>
	);
};
