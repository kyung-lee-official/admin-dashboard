import { ExpandLessOutlined } from "@/app/app/retail/sales-data/kanban/Icons";
import { ReactNode, useState } from "react";

export const PageContainer = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<div className="relative flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			{children}
		</div>
	);
};

export const PageBlock = (props: {
	title: string | ReactNode;
	moreMenu?: ReactNode;
	children?: ReactNode;
	allowCollapse?: boolean;
}) => {
	const { title, moreMenu, children, allowCollapse } = props;
	const [collapse, setCollapse] = useState(false);
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
				{allowCollapse && (
					<button
						className={`text-white/50 hover:text-white/80
						cursor-pointer
						${collapse && "rotate-90"} duration-200`}
						onClick={() => setCollapse(!collapse)}
					>
						<ExpandLessOutlined size={24} />
					</button>
				)}
			</div>
			{!collapse && children && (
				<div className="text-neutral-400">{children}</div>
			)}
		</div>
	);
};
