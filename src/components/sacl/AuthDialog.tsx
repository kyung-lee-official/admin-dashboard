import { ReactNode } from "react";

export const AuthDialog = (props: { title: string; children: ReactNode }) => {
	const { title, children } = props;
	return (
		<div
			className="flex flex-col items-center w-full max-w-[600px] p-6 gap-6
			bg-white
			rounded shadow-lg"
		>
			<h1 className="text-3xl">{title}</h1>
			<div className="w-full">{children}</div>
		</div>
	);
};
