import { HTMLAttributes } from "react";

export const Square = (props: HTMLAttributes<HTMLDivElement>) => {
	const { children, onMouseOver, onMouseOut } = props;
	return (
		<div
			className="relative
			flex justify-center items-center aspect-square w-28
			bg-white/30
			rounded-md overflow-hidden"
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
		>
			{children}
		</div>
	);
};
