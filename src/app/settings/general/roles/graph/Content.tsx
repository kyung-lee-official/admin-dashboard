"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import dynamic from "next/dynamic";
const DynamicRolesGraph = dynamic(() => import("./RolesGraph"), {
	ssr: false,
});

export const Content = () => {
	return (
		<PageContainer>
			<PageBlock title="Roles Graph">
				<DynamicRolesGraph />
			</PageBlock>
		</PageContainer>
	);
};
