"use client";

import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import {
	getEventById,
	getStatById,
	PerformanceQK,
} from "@/utils/api/app/performance";
import {
	FindEventByIdResponse,
	PerformanceStatResponse,
} from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";

export const Content = (props: {
	statId: string;
	sectionId: string;
	eventId: string;
}) => {
	const { statId, sectionId, eventId } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const statsQuery = useQuery<PerformanceStatResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_STAT_BY_ID, parseInt(statId), jwt],
		queryFn: async () => {
			const stats = await getStatById(parseInt(statId), jwt);
			return stats;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const eventQuery = useQuery<FindEventByIdResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_EVENT_BY_ID, parseInt(eventId), jwt],
		queryFn: async () => {
			const event = await getEventById(eventId, jwt);
			return event;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (statsQuery.isLoading) return <Loading />;
	if (statsQuery.isError) return <div>Error: {statsQuery.error.message}</div>;
	if (!statsQuery.data) {
		return null;
	}
	const { month, owner, statSections } = statsQuery.data;

	if (eventQuery.isPending) return <Loading />;
	if (eventQuery.isError)
		return <div>Error: {eventQuery.error?.message}</div>;
	if (!eventQuery.data) return null;
	const { section } = eventQuery.data;

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
							<td>{dayjs(month).format("MMMM YYYY")}</td>
						</tr>
						<tr>
							<td>Owner</td>
							<td>
								{owner.name} ({owner.email})
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
					</tbody>
				</table>
			</div>
			<div
				className="text-white/50
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div>Content</div>
				</div>
				<table
					className="w-full
					text-sm text-white/50"
				>
					<tbody
						className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
						{/* <tr>
							<td className="w-1/2">Score</td>
							<td className="w-1/2">
								{template?.id ? template?.id : ""}
							</td>
						</tr>
						<tr>
							<td className="w-1/2">Score</td>
							<td className="w-1/2">
								{template?.id ? template?.id : ""}
							</td>
						</tr>
						<tr>
							<td className="w-1/2">Description</td>
							<td className="w-1/2">
								{template?.id
									? template?.description
									: description}
							</td>
						</tr> */}
						<tr>
							<td className="w-1/2">Attachments</td>
							<td className="w-1/2">
								You must create the event before you can upload
								attachments
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};
