"use client";

import { Button } from "@/components/button/Button";
import { ConfirmDialogWithButton } from "@/components/confirm-dialog/ConfirmDialogWithButton";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";
import { useAuthStore } from "@/stores/auth";
import {
	createYouTubeTask,
	getYouTubeTasks,
	SnsYouTubeDataQK,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
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
		<PageContainer>
			<PageBlock
				title="Tasks"
				moreMenu={
					<ConfirmDialogWithButton
						question={"Create a new task?"}
						onOk={onCreate}
					>
						<Button size="sm">Create</Button>
					</ConfirmDialogWithButton>
				}
			>
				{getYouTubeTasksQuery.data && (
					<Table>
						<Thead>
							<tr>
								<th>Task Id</th>
								<th>Task Created At</th>
							</tr>
						</Thead>
						<Tbody>
							{getYouTubeTasksQuery.data &&
								[...getYouTubeTasksQuery.data].map(
									(t, i: number) => {
										return (
											<tr
												key={t.id}
												className="cursor-pointer"
												onClick={() => {
													router.push(
														`collection-tasks/${t.id}`
													);
												}}
											>
												<td>{t.id}</td>
												<td>
													{dayjs(t.createdAt).format(
														"MMM DD, YYYY HH:mm:ss"
													)}
												</td>
											</tr>
										);
									}
								)}
						</Tbody>
					</Table>
				)}
			</PageBlock>
		</PageContainer>
	);
};
