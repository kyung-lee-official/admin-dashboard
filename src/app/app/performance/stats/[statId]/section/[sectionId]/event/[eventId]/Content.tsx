"use client";

import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getEventById, PerformanceQK } from "@/utils/api/app/performance";
import { EventResponse } from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { Details } from "./Details";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
import { AxiosExceptions } from "@/components/page-authorization/AxiosExceptions";
import { Approval } from "./Approval";
import { useState } from "react";
import { Attachments } from "./attachments/Attachments";

export const Content = (props: {
	statId: number;
	sectionId: number;
	eventId: number;
}) => {
	const { statId, sectionId, eventId } = props;

	const [isEditing, setIsEditing] = useState(false);

	const jwt = useAuthStore((state) => state.jwt);
	const eventQuery = useQuery<EventResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_EVENT_BY_ID, eventId],
		queryFn: async () => {
			const event = await getEventById(eventId, jwt);
			return event;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (eventQuery.isLoading) return <Loading />;
	if (eventQuery.isError) return <AxiosExceptions error={eventQuery.error} />;
	if (eventQuery.data) {
		return (
			<PageContainer>
				<PageBlock title="Stat">
					<Table>
						<Tbody>
							<tr>
								<td>Month</td>
								<td>
									{dayjs(
										eventQuery.data.section.stat.month
									).format("MMMM YYYY")}
								</td>
							</tr>
							<tr>
								<td>Owner</td>
								<td>
									{eventQuery.data.section.stat.owner.name} (
									{eventQuery.data.section.stat.owner.email})
								</td>
							</tr>
						</Tbody>
					</Table>
				</PageBlock>
				<PageBlock title="Section">
					<Table>
						<Tbody>
							<tr>
								<td>Section Role</td>
								<td>
									<div
										className="flex w-fit px-1 gap-2
											border border-neutral-500 rounded"
									>
										<div>
											{
												eventQuery.data.section
													.memberRole.name
											}
										</div>
										<div className="text-neutral-500">
											{
												eventQuery.data.section
													.memberRole.id
											}
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td>Section Title</td>
								<td>{eventQuery.data.section.title}</td>
							</tr>
							<tr>
								<td>Section Weight</td>
								<td>{eventQuery.data.section.weight}</td>
							</tr>
							<tr>
								<td>Section Description</td>
								<td>{eventQuery.data.section.description}</td>
							</tr>
						</Tbody>
					</Table>
				</PageBlock>
				<Approval event={eventQuery.data} setIsEditing={setIsEditing} />
				<Details
					statId={statId}
					sectionId={sectionId}
					event={eventQuery.data}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
				/>
				<Attachments event={eventQuery.data} />
			</PageContainer>
		);
	} else {
		return <AxiosExceptions />;
	}
};
