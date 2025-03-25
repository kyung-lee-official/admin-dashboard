"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import Link from "next/link";

export const Content = () => {
	return (
		<PageContainer>
			<PageBlock title="YouTube Data Collector">
				<Link
					href={"youtube-data-collector/manage-token"}
					className="flex items-center px-6 py-4 gap-6
					text-sm
					hover:bg-white/5
					border-t-[1px] border-white/10"
				>
					Manage Token
				</Link>
				<Link
					href={"youtube-data-collector/source-data"}
					className="flex items-center px-6 py-4 gap-6
					text-sm
					hover:bg-white/5
					border-t-[1px] border-white/10"
				>
					Source Data
				</Link>
				<Link
					href={"youtube-data-collector/collection-tasks"}
					className="flex items-center px-6 py-4 gap-6
					text-sm
					hover:bg-white/5
					border-t-[1px] border-white/10"
				>
					Collection Tasks
				</Link>
			</PageBlock>
		</PageContainer>
	);
};
