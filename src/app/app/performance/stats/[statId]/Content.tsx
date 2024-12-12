"use client";

import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getStatById } from "@/utils/api/app/performance";
import { PerformanceStatResponse } from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { TitleMoreMenu } from "./moreMenu/TitleMoreMenu";

export const Content = (props: { statId: string }) => {
	const { statId } = props;

	const jwt = useAuthStore((state) => state.jwt);
	const router = useRouter();

	const statsQuery = useQuery<PerformanceStatResponse, AxiosError>({
		queryKey: ["get-performance-stat-by-id", parseInt(statId), jwt],
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

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="flex flex-col gap-3
				text-white/90"
			>
				<div
					className="relative flex flex-col
					bg-white/5
					border-[1px] border-white/10 border-t-white/15
					rounded-md"
				>
					<div className="flex justify-between items-center w-full px-6 py-4">
						<div className="text-lg font-semibold">Stat</div>
						<TitleMoreMenu />
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
					className="flex flex-col
					text-white/50
					bg-white/5
					border-[1px] border-white/10 border-t-white/15
					rounded-md"
				>
					<div
						className="px-6 py-4
						text-lg font-semibold"
					>
						Sections
					</div>
					<table
						className="w-full
						text-sm"
					>
						<thead
							className="[&_>_tr_>_th]:py-3 [&_>_tr_>_th]:px-6
							[&_>_tr_>_th]:text-left font-semibold
							[&_>_tr_>_th]:border-t-[1px] [&_>_tr_>_th]:border-white/10"
						>
							<tr>
								<th className="w-2/12">Section Title</th>
								<th className="w-2/12">Weight</th>
								<th className="w-8/12">Description</th>
							</tr>
						</thead>
						<tbody
							className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
							hover:[&_>_tr]:bg-white/5
							[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10
							[&_>_tr]:cursor-pointer"
						>
							{statSections.map((s, i) => {
								return (
									<tr
										key={i}
										onClick={() => {
											router.push(
												`${statId}/section/${s.id}`
											);
										}}
									>
										<td>{s.title}</td>
										<td>{s.weight}</td>
										<td>{s.description}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
