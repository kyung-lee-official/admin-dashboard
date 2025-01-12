export const CircularProgress = (props: { size: number; progress: number }) => {
	const { size, progress } = props;
	const strokeWidth = 12;
	return (
		<div>
			<svg width={size} height={size} viewBox="0 0 100 100">
				<circle
					cx="50%"
					cy="50%"
					r="42%"
					fill="none"
					strokeWidth={strokeWidth}
					className="stroke-black/10"
				/>
				<circle
					cx="50%"
					cy="50%"
					r="42%"
					fill="none"
					strokeWidth={strokeWidth}
					pathLength={
						100
					} /* pathLength sets the length of the path, which is used to calculate the length of the dash array */
					strokeDasharray={`${progress}, 100`}
					strokeLinecap="round"
					className="stroke-black/40
					origin-center -rotate-90"
				/>
			</svg>
		</div>
	);
};
