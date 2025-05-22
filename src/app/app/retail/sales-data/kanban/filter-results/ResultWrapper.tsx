import { ReactNode } from "react";

export const ResultWrapper = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<div className="min-h-[525px] max-h-[90svh] overflow-y-auto scrollbar">
			{children}
		</div>
	);
};
