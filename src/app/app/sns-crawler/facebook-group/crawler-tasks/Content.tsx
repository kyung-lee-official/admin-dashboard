"use client";

import { Button } from "@/components/button/Button";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useAuthStore } from "@/stores/auth";
import {
	getFacebookGroupCrawlerStatus,
	getFacebookGroupCrawlerTasks,
	SnsCrawlerQK,
	createFacebookGroupCrawlerTask,
	facebookGroupCrawlerTaskStartCrawling,
} from "@/utils/api/app/sns-crawler";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Content = () => {
	const jwt = useAuthStore((state) => state.jwt);
	const router = useRouter();
	const [showStartConfirmation, setShowStartConfirmation] = useState(false);

	const getFacebookGroupCrawlerTasksQuery = useQuery<any, AxiosError>({
		queryKey: [SnsCrawlerQK.GET_FACEBOOK_GROUP_CRAWLER_TASKS, jwt],
		queryFn: async () => {
			const facebookGroupSourceData = await getFacebookGroupCrawlerTasks(
				jwt
			);
			return facebookGroupSourceData;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const getFacebookGroupCrawlerStatusQuery = useQuery<any, AxiosError>({
		queryKey: [SnsCrawlerQK.GET_FACEBOOK_GROUP_CRAWLER_STATUS, jwt],
		queryFn: async () => {
			const facebookGroupSourceData = await getFacebookGroupCrawlerStatus(
				jwt
			);
			return facebookGroupSourceData;
		},
		refetchInterval: 2000,
	});

	const mutation = useMutation({
		mutationFn: () => {
			return createFacebookGroupCrawlerTask(jwt);
		},
		onSuccess: async (data) => {
			facebookGroupCrawlerTaskStartCrawling(data.taskId!, jwt);
			router.push(`crawler-tasks/${data.taskId}`);
		},
		onError: () => {},
	});

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex items-center px-6 py-4">
					<div className="text-lg font-semibold">Crawler Tasks</div>
				</div>
				<div
					className="flex items-center px-6 py-4 gap-6
					text-sm
					border-t-[1px] border-white/10"
				>
					{getFacebookGroupCrawlerStatusQuery.data?.browserRunning ? (
						<div className="flex items-center gap-4">
							<div className="text-white/50">
								Task{" "}
								<Link
									href={`crawler-tasks/${getFacebookGroupCrawlerStatusQuery.data?.taskId}`}
									className="underline"
								>
									{
										getFacebookGroupCrawlerStatusQuery.data
											?.taskId
									}
								</Link>{" "}
								is running
							</div>
							<div
								className="w-2.5 h-2.5
								bg-green-500
								rounded-full border-1 border-green-500"
							></div>
						</div>
					) : (
						<div className="flex items-center gap-4">
							<Button
								size="sm"
								onClick={() => {
									setShowStartConfirmation(true);
								}}
							>
								Start
							</Button>
							<div
								className="w-2.5 h-2.5
								rounded-full border-1 border-white/30"
							></div>
							<div className="text-white/50">Crawler Idle</div>
						</div>
					)}

					<ConfirmDialog
						show={showStartConfirmation}
						setShow={setShowStartConfirmation}
						question={"Start crawling?"}
						onOk={() => {
							mutation.mutate();
							setShowStartConfirmation(false);
						}}
					/>
				</div>
			</div>
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex items-center px-6 py-4">
					<div>Tasks</div>
				</div>
				<table className="w-full">
					<tbody>
						{getFacebookGroupCrawlerTasksQuery.data &&
							/* sort by createdAt */
							getFacebookGroupCrawlerTasksQuery.data
								.sort((a: any, b: any) => {
									return (
										new Date(b.createdAt).getTime() -
										new Date(a.createdAt).getTime()
									);
								})
								.map((task: any, i: number) => {
									return (
										<tr
											key={i}
											onClick={() => {
												router.push(
													`crawler-tasks/${task.id}`
												);
											}}
											className="text-white/50
											hover:bg-white/5
											border-t-[1px] border-white/10 cursor-pointer"
										>
											<td className="w-2/3 px-6 py-4">
												{task.id}
											</td>
											<td className="w-1/3 px-6 py-4">
												Created at:{" "}
												{new Date(
													task.createdAt
												).toLocaleString()}
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
