"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Exception } from "@/components/page-authorization/Exception";
import { Forbidden } from "@/components/page-authorization/Forbidden";
import { useAuthStore } from "@/stores/auth";
import { getPermissions, RolesQK } from "@/utils/api/roles";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
const DynamicRolesGraph = dynamic(() => import("./RolesGraph"), {
	ssr: false,
});

export const Content = () => {
	const jwt = useAuthStore((state) => state.jwt);

	const rolePermQuery = useQuery({
		queryKey: [RolesQK.GET_MY_ROLE_PERMISSIONS],
		queryFn: async () => {
			const data = await getPermissions(jwt);
			return data;
		},
	});
	if (rolePermQuery.isSuccess) {
		switch (rolePermQuery.data.actions["read"]) {
			case "EFFECT_DENY":
				return <Forbidden />;
			case "EFFECT_ALLOW":
				return (
					<PageContainer>
						<PageBlock title="Roles Graph">
							<DynamicRolesGraph />
						</PageBlock>
					</PageContainer>
				);
			default:
				return <Exception />;
		}
	} else {
		return <Exception />;
	}
};
