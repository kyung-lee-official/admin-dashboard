"use client";

import { Button } from "@/components/button/Button";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useAuthStore } from "@/stores/auth";
import {
	getFacebookGroupCrawlerTasks,
	SnsCrawlerQK,
	startFacebookGroupCrawler,
} from "@/utils/api/app/sns-crawler";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
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

	const mutation = useMutation({
		mutationFn: () => {
			return startFacebookGroupCrawler(jwt);
		},
		onSuccess: (data) => {
			console.log(data);
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
					<Button
						size="sm"
						onClick={() => {
							setShowStartConfirmation(true);
						}}
					>
						Start
					</Button>
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
