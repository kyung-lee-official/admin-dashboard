import { Table, Tbody, Thead } from "@/components/content/Table";
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
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const TemplateList = (props: { role?: MemberRole }) => {
	const { role } = props;

	const router = useRouter();
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
		<Table>
			<Thead>
				<tr>
					<th className="w-1/6">Template Score</th>
					<th>Template Description</th>
				</tr>
			</Thead>
			<Tbody>
				{role &&
					templatesQuery.isSuccess &&
					[...templatesQuery.data]
						.sort((a, b) => {
							return dayjs(a.createdAt).isBefore(
								dayjs(b.createdAt)
							)
								? 1
								: -1;
						})
						.map((template, i) => {
							return (
								<tr
									key={template.id}
									className="cursor-pointer"
									onClick={() => {
										router.push(
											`event-templates/${template.id}`
										);
									}}
								>
									<td>{template.score}</td>
									<td>{template.description}</td>
								</tr>
							);
						})}
			</Tbody>
		</Table>
	);
};
