"use client";

import { useAuthStore } from "@/stores/auth";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ControlBar } from "./ControlBar";
import { YouTubeDataTask, YouTubeToken } from "@/utils/types/app/sns-crawler";
import {
	getYouTubeTaskById,
	getYouTubeTokens,
	SnsYouTubeDataQK,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";

export enum TaskStatus {
	IDLE = "idle",
	PROCESSING = "processing",
	ABORTED = "aborted",
}

export const Content = (props: { taskId: number }) => {
	const { taskId } = props;

	const router = useRouter();
	const jwt = useAuthStore((state) => state.jwt);
	const getYouTubeTaskByIdQuery = useQuery<YouTubeDataTask>({
		queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TASK_BY_ID],
		queryFn: async () => {
			const youtubeTask = await getYouTubeTaskById(taskId, jwt);
			return youtubeTask;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [status, setStatus] = useState<TaskStatus>(TaskStatus.IDLE);
	const [range, setRange] = useState({
		start: dayjs().startOf("month"),
		end: dayjs().endOf("month"),
	});
	const [targetResultCount, setTargetResultCount] = useState(500);

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Tasks {taskId}</div>
				</div>
				{getYouTubeTaskByIdQuery.data && (
					<ControlBar
						taskId={taskId}
						youTubeDataTaskKeywords={
							getYouTubeTaskByIdQuery.data.youTubeDataTaskKeywords
						}
						status={status}
						setStatus={setStatus}
						range={range}
						setRange={setRange}
						targetResultCount={targetResultCount}
						setTargetResultCount={setTargetResultCount}
					/>
				)}
			</div>
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Keywords</div>
				</div>
				<table
					className="w-full
					text-sm text-white/50"
				>
					<thead className="[&_>_tr_>_th]:px-6 [&_>_tr_>_th]:py-2 [&_>_tr_>th]:text-left">
						<tr
							className="px-3 py-1
							text-sm
							border-t-[1px] border-white/10"
						>
							<th>Id</th>
							<th>Keyword</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody className="[&_>_tr_>_td]:px-6 [&_>_tr_>_td]:py-2">
						{getYouTubeTaskByIdQuery.data &&
							getYouTubeTaskByIdQuery.data.youTubeDataTaskKeywords.map(
								(k: any, i: number) => {
									return (
										<tr
											key={i}
											className="px-3 py-1
											text-sm
											hover:bg-white/10
											border-t-[1px] border-white/10 cursor-pointer"
											onClick={() => {
												router.push(
													`${taskId}/keyword/${k.id}`
												);
											}}
										>
											<td>{k.id}</td>
											<td>{k.keyword}</td>
											<td>{k.status}</td>
										</tr>
									);
								}
							)}
					</tbody>
				</table>
			</div>
		</div>
	);
};
