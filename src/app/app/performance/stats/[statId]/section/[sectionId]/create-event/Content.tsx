"use client";

import { Button } from "@/components/button/Button";
import { Loading } from "@/components/page-authorization/Loading";
import { Toggle } from "@/components/toggle/Toggle";
import { useAuthStore } from "@/stores/auth";
import { getStatById, PerformanceQK } from "@/utils/api/app/performance";
import { PerformanceStatResponse } from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";

export const Content = (props: { statId: string; sectionId: string }) => {
	const { statId, sectionId } = props;

	const jwt = useAuthStore((state) => state.jwt);
	const [useTemplate, setUseTemplate] = useState(true);

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
					{/* <TitleMoreMenu /> */}
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
					{/* <TitleMoreMenu /> */}
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
					<div>Create Event</div>
					<Button size="sm" onClick={() => {}}>
						Create
					</Button>
				</div>
				<table
					className="w-full
					text-sm text-white/50"
				>
					<tbody
						className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
						<tr>
							<td className="w-1/2">Use Template</td>
							<td className="w-1/2">
								<Toggle
									isOn={useTemplate}
									isAllowed={true}
									onClick={() => setUseTemplate(!useTemplate)}
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			{useTemplate && (
				<div
					className="text-white/50
					bg-white/5
					border-[1px] border-white/10 border-t-white/15
					rounded-md"
				>
					<div className="relative flex justify-between items-center px-6 py-4">
						<div>Template</div>
					</div>
					<table
						className="w-full
						text-sm text-white/50"
					>
						<tbody
							className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
							[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
						>
							<tr className={useTemplate ? "" : "text-white/20"}>
								<td className="w-1/2">Event Template</td>
								<td className="w-1/2">Template ID</td>
							</tr>
							<tr>
								<td className="w-1/2">Score</td>
								<td className="w-1/2">0</td>
							</tr>
							<tr>
								<td className="w-1/2">Description</td>
								<td className="w-1/2">Description</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
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
