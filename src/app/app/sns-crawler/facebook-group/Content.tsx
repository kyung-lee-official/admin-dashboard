"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Exception } from "@/components/page-authorization/Exception";
import { Forbidden } from "@/components/page-authorization/Forbidden";
import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import {
	getPermissions,
	SnsFacebookCrawlerQK,
} from "@/utils/api/app/sns-crawler/facebook-group-crawler";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export const Content = () => {
	const jwt = useAuthStore((state) => state.jwt);
	const snsCrawlerPermQuery = useQuery({
		queryKey: [SnsFacebookCrawlerQK.GET_FACEBOOK_GROUP_CRAWLER_PERMISSIONS],
		queryFn: async () => {
			const data = await getPermissions(jwt);
			return data;
		},
	});

	if (snsCrawlerPermQuery.isPending) {
		return <Loading />;
	}
	if (snsCrawlerPermQuery.isSuccess && snsCrawlerPermQuery.data) {
		switch (snsCrawlerPermQuery.data.actions["*"]) {
			case "EFFECT_DENY":
				return <Forbidden />;
			case "EFFECT_ALLOW":
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
			default:
				return <Exception />;
		}
	} else {
		return <Exception />;
	}
};
