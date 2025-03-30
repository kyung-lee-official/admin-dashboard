"use client";

import { Button } from "@/components/button/Button";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
import { Indicator } from "@/components/indecator/Indicator";
import { useAuthStore } from "@/stores/auth";
import {
	getFacebookGroupCrawlerStatus,
	getFacebookGroupCrawlerTasks,
	SnsFacebookCrawlerQK,
	createFacebookGroupCrawlerTask,
	facebookGroupCrawlerTaskStartCrawling,
} from "@/utils/api/app/sns-crawler/facebook-group-crawler";
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
		queryKey: [SnsFacebookCrawlerQK.GET_FACEBOOK_GROUP_CRAWLER_TASKS],
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
		queryKey: [SnsFacebookCrawlerQK.GET_FACEBOOK_GROUP_CRAWLER_STATUS],
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
		<PageContainer>
			<PageBlock title="Crawler Tasks">
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
							<Indicator isActive={true} />
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
							<Indicator
								isActive={false}
								labelText="Crawler Idle"
							/>
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
			</PageBlock>
			<PageBlock title="Tasks">
				<Table>
					<Tbody>
						{getFacebookGroupCrawlerTasksQuery.data &&
							/* sort by createdAt */
							[...getFacebookGroupCrawlerTasksQuery.data]
								.sort((a: any, b: any) => {
									return (
										new Date(b.createdAt).getTime() -
										new Date(a.createdAt).getTime()
									);
								})
								.map((task: any, i: number) => {
									return (
										<tr
											key={task.id}
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
					</Tbody>
				</Table>
			</PageBlock>
		</PageContainer>
	);
};
