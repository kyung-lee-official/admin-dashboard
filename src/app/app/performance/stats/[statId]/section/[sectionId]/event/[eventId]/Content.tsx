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
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="flex justify-between items-center w-full px-6 py-4">
					<div className="text-lg font-semibold">Stat</div>
				</div>
				<table
					className="w-full
					text-sm text-white/50"
				>
					<tbody
						className="[&_>_tr_>_td]:px-6 [&_>_tr_>_td]:py-3
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
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
					</tbody>
				</table>
			</div>
			<div
				className="text-white/50
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="flex justify-between items-center w-full px-6 py-4">
					<div className="text-lg font-semibold">Section</div>
				</div>
				<table
					className="w-full
					text-sm text-white/50"
				>
					<tbody
						className="[&_>_tr_>_td]:px-6 [&_>_tr_>_td]:py-3
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
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
					</tbody>
				</table>
			</div>
			{event ? (
				<Details statId={statId} sectionId={sectionId} event={event} />
			) : (
				<OneRowSkeleton />
			)}
		</div>
	);
};
