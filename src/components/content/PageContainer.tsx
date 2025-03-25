import { ReactNode } from "react";

export const PageContainer = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			{children}
		</div>
	);
};

export const PageBlock = (props: {
	title: string | ReactNode;
	moreMenu?: ReactNode;
	children?: ReactNode;
}) => {
	const { title, moreMenu, children } = props;
	return (
		<div
			className="bg-white/5
			border-[1px] border-white/10 border-t-white/15
			rounded-md"
		>
			<div className="flex justify-between items-center w-full px-6 py-4">
				<div
					className="w-full
					text-white/80 text-lg font-semibold"
				>
					{title}
				</div>
				{moreMenu && <div>{moreMenu}</div>}
			</div>
			{children && <div className="text-neutral-400">{children}</div>}
		</div>
	);
};
