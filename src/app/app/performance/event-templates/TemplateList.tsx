import { useAuthStore } from "@/stores/auth";
import {
	getTemplatesByRoleId,
	PerformanceQK,
} from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { PerformanceEventTemplateResponse } from "@/utils/types/app/performance";
import { MemberRole } from "@/utils/types/internal";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect } from "react";

export const TemplateList = (props: { role?: MemberRole }) => {
	const { role } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const templatesQuery = useQuery<
		PerformanceEventTemplateResponse[],
		AxiosError
	>({
		queryKey: [PerformanceQK.GET_TEMPLATES_BY_ROLE_ID],
		queryFn: async () => {
			const templates = await getTemplatesByRoleId(role!.id, jwt);
			return templates;
		},
		retry: false,
		enabled: !!role,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		queryClient.invalidateQueries({
			queryKey: [PerformanceQK.GET_TEMPLATES_BY_ROLE_ID],
		});
	}, [role]);

	return (
		<div
			className="flex flex-col
			text-white/50"
		>
			{role &&
				templatesQuery.isSuccess &&
				templatesQuery.data
					.sort((a, b) => {
						return dayjs(a.createdAt).isBefore(dayjs(b.createdAt))
							? 1
							: -1;
					})
					.map((template, i) => {
						return (
							<Link
								href={`event-templates/${template.id}`}
								key={i}
								className="flex items-center h-11 px-6
								text-sm
								hover:bg-white/5
								border-t-[1px] border-white/10"
							>
								{template.description}
							</Link>
						);
					})}
		</div>
	);
};
