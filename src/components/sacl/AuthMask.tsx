import { ReactNode } from "react";

export const AuthMask = ({ children }: { children: ReactNode }) => {
	return (
		<div
			className="flex justify-center items-center h-screen w-screen
			text-neutral-600 dark:text-neutral-100
			bg-neutral-100 dark:bg-neutral-800
			z-20"
		>
			{children}
		</div>
	);
};
