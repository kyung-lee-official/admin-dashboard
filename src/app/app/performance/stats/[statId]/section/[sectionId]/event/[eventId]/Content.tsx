"use client";

import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getStatById, PerformanceQK } from "@/utils/api/app/performance";
import {
	EventResponse,
	PerformanceStatResponse,
	SectionResponse,
} from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Details } from "./Details";
import { OneRowSkeleton } from "@/components/skeleton/OneRowSkeleton";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";

export const Content = (props: {
	statId: string;
	sectionId: string;
	eventId: string;
}) => {
	const statId = parseInt(props.statId);
	const sectionId = parseInt(props.sectionId);
	const eventId = parseInt(props.eventId);

	const jwt = useAuthStore((state) => state.jwt);

	const statsQuery = useQuery<PerformanceStatResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_STAT_BY_ID],
		queryFn: async () => {
			const stats = await getStatById(statId, jwt);
			return stats;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});
	const [section, setSection] = useState<SectionResponse>();
	const [event, setEvent] = useState<EventResponse>();
	useEffect(() => {
		if (statsQuery.isSuccess) {
			const section = statsQuery.data.statSections.find(
				(s) => s.id === sectionId
			);
			setSection(section);
			if (section) {
				const event = section.events.find((e) => e.id === eventId);
				if (event) {
					setEvent(event);
				}
			}
		}
	}, [statsQuery.data]);

	if (statsQuery.isLoading) return <Loading />;
	if (statsQuery.isError) return <div>Error: {statsQuery.error.message}</div>;

	return (
		<PageContainer>
			<PageBlock title="Stat">
				<Table>
					<Tbody>
						<tr>
							<td>Month</td>
							<td>
								{dayjs(statsQuery.data?.month).format(
									"MMMM YYYY"
								)}
							</td>
						</tr>
						<tr>
							<td>Owner</td>
							<td>
								{statsQuery.data?.owner.name} (
								{statsQuery.data?.owner.email})
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
							<td>
								{section ? section.title : <OneRowSkeleton />}
							</td>
						</tr>
						<tr>
							<td>Section Weight</td>
							<td>
								{section ? section.weight : <OneRowSkeleton />}
							</td>
						</tr>
						<tr>
							<td>Section Description</td>
							<td>
								{section ? (
									section.description
								) : (
									<OneRowSkeleton />
								)}
							</td>
						</tr>
					</Tbody>
				</Table>
			</PageBlock>
			{event ? (
				<Details statId={statId} sectionId={sectionId} event={event} />
			) : (
				<OneRowSkeleton />
			)}
		</PageContainer>
	);
};
