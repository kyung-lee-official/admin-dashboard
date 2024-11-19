export const Mask = () => {
	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none select-none">
			<svg
				viewBox="0 0 100 100"
				xmlns="http://www.w3.org/2000/svg"
				className="rounded-md"
				onDrag={(e) => {
					e.preventDefault();
				}}
			>
				<rect
					width="100%"
					height="100%"
					className="fill-neutral-800/60 [mask:url(#circleMask)]"
				/>
				{/* avatar ring */}
				<circle
					cx={"50%"}
					cy={"50%"}
					r={49}
					className="fill-none stroke-white"
				></circle>
				{/* mask */}
				<mask id="circleMask">
					<rect width="100%" height="100%" fill="white" />
					<circle
						cx={"50%"}
						cy={"50%"}
						r={49}
						className="fill-black"
					></circle>
				</mask>
			</svg>
		</div>
	);
};
