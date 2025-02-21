"use client";

import Link from "next/link";

export const Content = () => {
	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex items-center px-6 py-4">
					<div className="text-lg font-semibold">Facebook Group</div>
				</div>
				<Link
					href={"facebook-group/source-data"}
					className="flex items-center px-6 py-4 gap-6
					text-sm
					hover:bg-white/5
					border-t-[1px] border-white/10"
				>
					Source Data
				</Link>
				<Link
					href={"facebook-group/crawler-tasks"}
					className="flex items-center px-6 py-4 gap-6
					text-sm
					hover:bg-white/5
					border-t-[1px] border-white/10"
				>
					Crawler Tasks
				</Link>
			</div>
		</div>
	);
};
