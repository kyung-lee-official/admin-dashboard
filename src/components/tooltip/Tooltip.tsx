import { ReactNode, useState } from "react";

const Tooltip = (props: { text: string; children: ReactNode }) => {
	const { text, children } = props;
	const [isVisible, setIsVisible] = useState(false);

	const showTooltip = () => setIsVisible(true);
	const hideTooltip = () => setIsVisible(false);

	return (
		/**
		 * this div ensures that the tooltip is positioned correctly even if the parent uses
		 * flex-direction: column
		 */
		<div className="flex">
			<div
				className="relative"
				onMouseEnter={showTooltip}
				onMouseLeave={hideTooltip}
			>
				{children}
				{isVisible && (
					/**
					 * to break through the width of the parent (the relative div),
					 * we need to set a fix width first, then nest the tooltip inside of it,
					 * so that we technically have a fixed width container as max-width
					 * and a nested tooltip with dynamic width
					 */
					<div
						className="absolute top-0 left-full
						w-[250px]
						z-10"
					>
						<div
							className="w-fit p-2 ml-2
							text-neutral-400 text-xs
							bg-neutral-700
							shadow-lg rounded"
						>
							{text}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Tooltip;
