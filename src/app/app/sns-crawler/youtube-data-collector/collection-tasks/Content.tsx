"use client";

import { Button } from "@/components/button/Button";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useAuthStore } from "@/stores/auth";
import {
	createYouTubeTask,
	getYouTubeTasks,
	SnsYouTubeDataQK,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Content = () => {
	const router = useRouter();
	const jwt = useAuthStore((state) => state.jwt);
	const getYouTubeTasksQuery = useQuery({
		queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TASKS],
		queryFn: async () => {
			const youtubeToken = await getYouTubeTasks(jwt);
			return youtubeToken;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);
	const mutation = useMutation({
		mutationFn: () => {
			return createYouTubeTask(jwt);
		},
		onSuccess: (data) => {
			router.push(
				`/app/sns-crawler/youtube-data-collector/collection-tasks/${data.id}`
			);
		},
		onError: () => {},
	});
	function onCreate() {
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
					<div className="text-lg font-semibold">Tasks </div>
					<Button
						size="sm"
						onClick={() => {
							setShowCreateConfirmation(true);
						}}
					>
						Create
					</Button>
					<ConfirmDialog
						show={showCreateConfirmation}
						setShow={setShowCreateConfirmation}
						question={"Create a new task?"}
						onOk={onCreate}
					/>
				</div>
				{getYouTubeTasksQuery.data && (
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
								<th>Task Id</th>
								<th>Task Created At</th>
							</tr>
						</thead>
						<tbody className="[&_>_tr_>_td]:px-6 [&_>_tr_>_td]:py-2">
							{getYouTubeTasksQuery.data &&
								getYouTubeTasksQuery.data.map(
									(t: any, i: number) => {
										return (
											<tr
												key={i}
												className="px-3 py-1
												text-sm
												hover:bg-white/10
												border-t-[1px] border-white/10 cursor-pointer"
												onClick={() => {
													router.push(
														`collection-tasks/${t.id}`
													);
												}}
											>
												<td>{t.id}</td>
												<td>{t.createdAt}</td>
											</tr>
										);
									}
								)}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};
