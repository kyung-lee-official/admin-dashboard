import { ReactNode } from "react";

export const ResultWrapper = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<div className="min-h-[525px] overflow-y-auto scrollbar">
			{children}
		</div>
	);
};
