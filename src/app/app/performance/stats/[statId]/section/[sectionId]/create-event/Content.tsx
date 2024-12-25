"use client";

import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getStatById, PerformanceQK } from "@/utils/api/app/performance";
import { PerformanceStatResponse } from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { CreateEvent } from "./CreateEvent";

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
			<CreateEvent statId={statId} sectionId={sectionId} />
		</div>
	);
};
