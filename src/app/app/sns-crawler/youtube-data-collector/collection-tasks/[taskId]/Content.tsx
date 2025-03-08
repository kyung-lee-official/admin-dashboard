"use client";

import { useAuthStore } from "@/stores/auth";

import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ControlBar } from "./ControlBar";
import { YouTubeDataTask } from "@/utils/types/app/sns-crawler";
import {
	deleteYouTubeTaskById,
	getYouTubeTaskById,
	getYouTubeTaskMeta,
	SnsYouTubeDataQK,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";
import { Indicator } from "@/components/indecator/Indicator";
import { Button } from "@/components/button/Button";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { HorizontalProgress } from "@/components/progress/horizontal-progress/HorizontalProgress";

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
		refetchInterval: 1000,
		refetchOnWindowFocus: false,
	});

	const getYouTubeTaskMetaQuery = useQuery({
		queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TASK_META],
		queryFn: async () => {
			const youtubeTaskMeta = await getYouTubeTaskMeta(jwt);
			return youtubeTaskMeta;
		},
		refetchInterval: 1000,
		refetchOnWindowFocus: false,
	});

	const [status, setStatus] = useState<TaskStatus>(TaskStatus.IDLE);
	const [range, setRange] = useState({
		start: dayjs().startOf("month"),
		end: dayjs().endOf("month"),
	});
	const [targetResultCount, setTargetResultCount] = useState(500);

	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const mutation = useMutation({
		mutationFn: () => {
			return deleteYouTubeTaskById(taskId, jwt);
		},
		onSuccess: () => {
			router.push(
				"/app/sns-crawler/youtube-data-collector/collection-tasks"
			);
		},
		onError: () => {},
	});
	function onDelete() {
		mutation.mutate();
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
					<div className="text-lg font-semibold">Tasks {taskId} </div>
					<Button
						size="sm"
						onClick={() => {
							setShowDeleteConfirmation(true);
						}}
					>
						Delete
					</Button>
					<ConfirmDialog
						show={showDeleteConfirmation}
						setShow={setShowDeleteConfirmation}
						question={"Are you sure you want to delete this task?"}
						onOk={onDelete}
					/>
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
				<div className="flex items-center px-6 py-4">
					YouTube Data Collector Service Status
					<Indicator
						isActive={
							getYouTubeTaskMetaQuery.data?.status === "running"
						}
					/>
				</div>
			</div>
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div>
					<div className="relative flex justify-between items-center px-6 py-4">
						<div className="text-lg font-semibold">Keywords</div>
					</div>
					<HorizontalProgress
						progress={
							getYouTubeTaskByIdQuery.data
								? (getYouTubeTaskByIdQuery.data.youTubeDataTaskKeywords.filter(
										(k) => {
											return k.status === "SUCCESS";
										}
								  ).length /
										getYouTubeTaskByIdQuery.data
											.youTubeDataTaskKeywords.length) *
								  100
								: 0
						}
						borderRadius="rounded-none"
					/>
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
