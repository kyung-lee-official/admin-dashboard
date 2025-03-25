"use client";

import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getStatById, PerformanceQK } from "@/utils/api/app/performance";
import { PerformanceStatResponse } from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { CreateEvent } from "./CreateEvent";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";

export const Content = (props: { statId: string; sectionId: string }) => {
	const { statId, sectionId } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const statsQuery = useQuery<PerformanceStatResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_STAT_BY_ID],
		queryFn: async () => {
			const stats = await getStatById(parseInt(statId), jwt);
			return stats;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (statsQuery.isLoading) return <Loading />;

	if (statsQuery.isError) return <div>Error: {statsQuery.error.message}</div>;

	if (!statsQuery.data) {
		return null;
	}
	const { month, owner, statSections } = statsQuery.data!;

	const section = statSections.find((s) => s.id === parseInt(sectionId));
	if (!section) {
		return null;
	}

	return (
		<PageContainer>
			<PageBlock title="Stat">
				<Table>
					<Tbody>
						<tr>
							<td>Month</td>
							<td>{dayjs(month).format("MMMM YYYY")}</td>
						</tr>
						<tr>
							<td>Owner</td>
							<td>
								{owner.name} ({owner.email})
							</td>
						</tr>
					</Tbody>
				</Table>
			</PageBlock>
			<PageBlock title="Section">
				<Table>
					<Tbody>
						<tr>
							<td>Section Title</td>
							<td>{section.title}</td>
						</tr>
						<tr>
							<td>Section Weight</td>
							<td>{section.weight}</td>
						</tr>
						<tr>
							<td>Section Description</td>
							<td>{section.description}</td>
						</tr>
					</Tbody>
				</Table>
			</PageBlock>
			<CreateEvent statId={statId} sectionId={sectionId} />
		</PageContainer>
	);
};
