"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import Link from "next/link";

export const Content = () => {
	return (
		<PageContainer>
			<PageBlock title="Facebook Group">
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
			</PageBlock>
		</PageContainer>
	);
};
