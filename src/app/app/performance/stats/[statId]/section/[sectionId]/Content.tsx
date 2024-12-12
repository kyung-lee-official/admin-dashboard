"use client";

import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getStatById, PerformanceQK } from "@/utils/api/app/performance";
import {
	EventResponse,
	PerformanceStatResponse,
} from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Link from "next/link";

export const Content = (props: { statId: string; sectionId: string }) => {
	const { statId, sectionId } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const statsQuery = useQuery<PerformanceStatResponse, AxiosError>({
		queryKey: [
			PerformanceQK.GET_PERFORMANCE_STAT_BY_ID,
			parseInt(statId),
			jwt,
		],
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
	const { month, statSections } = statsQuery.data!;

	const section = statSections.find((s) => s.id === parseInt(sectionId));
	if (!section) {
		return null;
	}

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="flex flex-col">
						<div className="text-lg font-semibold">Stat</div>
						<div className="text-sm text-white/50">
							{dayjs(month).format("MMMM YYYY")}
						</div>
					</div>
					{/* <TitleMoreMenu /> */}
				</div>
				<div
					className="flex flex-col items-center px-6 py-4 gap-3
					text-sm text-white/50
					rounded-md border-t-[1px] border-white/10"
				>
					<div className="flex justify-between w-full">
						<div>{section.title}</div>
						<div>Weight {section.weight}</div>
					</div>
					<div className="w-full">{section.description}</div>
				</div>
			</div>
			<div
				className="text-white/50
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="">Events</div>
					{/* <TitleMoreMenu /> */}
					Create
				</div>
				<table className="text-sm text-white/50">
					<tbody
						className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
						<tr>
							<td className="w-1/2">Description</td>
							<td className="w-1/2">Score</td>
							<td>
								<div className="w-7 h-7">
									{/* placeholder */}
								</div>
							</td>
						</tr>
						{section.events.map((ev: EventResponse, i) => {
							return (
								<tr key={i}>
									<td className="w-1/2">{ev.description}</td>
									<td className="w-1/2">{ev.score}</td>
									<td>
										<Link
											href={`${section.id}/event/${ev.id}`}
										>
											Edit
										</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
