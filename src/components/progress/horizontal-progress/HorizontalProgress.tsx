type ProgressBarProps = {
	progress: number /* percentage from 0 to 100 */;
	height?: string /* optional height of the progress bar */;
	backgroundColor?: string /* optional background color */;
	fillColor?: string /* optional fill color */;
	borderRadius?: string /* optional border radius */;
	className?: string /* optional additional class names */;
};

export const HorizontalProgress = ({
	progress,
	height = "h-0.5",
	backgroundColor = "bg-none",
	fillColor = "bg-white/70",
	borderRadius = "rounded-full",
	className = "",
}: ProgressBarProps) => {
	/* ensure progress is within 0-100 */
	const clampedProgress = Math.max(0, Math.min(100, progress));
	return (
		<div
			className={`relative ${height} ${backgroundColor} ${borderRadius} overflow-hidden w-full ${className}`}
		>
			<div
				className={`absolute top-0 left-0 ${height} ${fillColor} ${borderRadius}
				duration-150`}
				style={{ width: `${clampedProgress}%` }}
			/>
		</div>
	);
};
