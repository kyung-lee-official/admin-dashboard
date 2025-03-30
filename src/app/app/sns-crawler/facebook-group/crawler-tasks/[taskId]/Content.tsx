"use client";

import { Button } from "@/components/button/Button";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { DeleteIcon, ExportIcon } from "@/components/icons/Icons";
import { Indicator } from "@/components/indecator/Indicator";
import { HorizontalProgress } from "@/components/progress/horizontal-progress/HorizontalProgress";
import { useAuthStore } from "@/stores/auth";
import {
	abortFacebookGroupCrawler,
	deleteFacebookGroupCrawlerTask,
	getFacebookGroupCrawlerStatus,
	getFacebookGroupCrawlerTaskById,
	recrawlFailedRecords,
	SnsFacebookCrawlerQK,
} from "@/utils/api/app/sns-crawler/facebook-group-crawler";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as ExcelJS from "exceljs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Content = (props: { taskId: number }) => {
	const { taskId } = props;
	const jwt = useAuthStore((state) => state.jwt);
	const router = useRouter();
	const [pendingAbort, setPendingAbort] = useState(false);

	const getFacebookGroupCrawlerTaskByIdQuery = useQuery({
		queryKey: [SnsFacebookCrawlerQK.GET_FACEBOOK_GROUP_CRAWLER_TASK_BY_ID],
		queryFn: async () => {
			const facebookGroupSourceData =
				await getFacebookGroupCrawlerTaskById(taskId, jwt);
			return facebookGroupSourceData;
		},
		retry: false,
		refetchInterval: 2000,
	});

	const getFacebookGroupCrawlerStatusQuery = useQuery({
		queryKey: [SnsFacebookCrawlerQK.GET_FACEBOOK_GROUP_CRAWLER_STATUS],
		queryFn: async () => {
			const facebookGroupSourceData = await getFacebookGroupCrawlerStatus(
				jwt
			);
			return facebookGroupSourceData;
		},
		refetchInterval: 2000,
	});

	useEffect(() => {
		if (getFacebookGroupCrawlerStatusQuery.data) {
			if (getFacebookGroupCrawlerStatusQuery.data.pendingAbort) {
				setPendingAbort(true);
			} else {
				setPendingAbort(false);
			}
		}
	}, [getFacebookGroupCrawlerStatusQuery.data]);

	const mutation = useMutation({
		mutationFn: () => {
			return abortFacebookGroupCrawler(jwt);
		},
		onSuccess: () => {},
		onError: () => {},
	});

	const recrawlFailedRecordsMutation = useMutation({
		mutationFn: () => {
			return recrawlFailedRecords(taskId, jwt);
		},
		onSuccess: () => {},
		onError: () => {},
	});

	const deleteTaskMutation = useMutation({
		mutationFn: () => {
			return deleteFacebookGroupCrawlerTask(taskId, jwt);
		},
		onSuccess: () => {
			router.push("/app/sns-crawler/facebook-group/crawler-tasks");
		},
		onError: () => {},
	});

	async function exportAsXlsx() {
		if (getFacebookGroupCrawlerTaskByIdQuery.data) {
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet("Sheet1");
			/* add header, set column width */
			worksheet.columns = [
				{ header: "Group Address", key: "groupAddress", width: 60 },
				{ header: "Group Name", key: "groupName", width: 55 },
				{ header: "Member Count", key: "memberCount", width: 20 },
				{
					header: "Monthly Post Count",
					key: "monthlyPostCount",
					width: 20,
				},
			];
			for (const record of getFacebookGroupCrawlerTaskByIdQuery.data
				.records) {
				worksheet.getRow(record.excelRow).values = [
					record.groupAddress,
					record.groupName,
					record.memberCount,
					record.monthlyPostCount,
				];
			}
			/* create blob from the workbook */
			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			/* create a download link and trigger the download */
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `facebook-group-crawler-task-${taskId}.xlsx`;
			a.click();
			window.URL.revokeObjectURL(url);
		}
	}

	return (
		<PageContainer>
			<PageBlock
				title={
					<div
						className="flex items-center gap-4
					text-lg font-semibold"
					>
						<div>Crawler Task {taskId}</div>
						<Indicator
							isActive={
								!!(
									getFacebookGroupCrawlerStatusQuery.data
										?.browserRunning &&
									getFacebookGroupCrawlerTaskByIdQuery.data
										?.id === taskId
								)
							}
							labelText={
								pendingAbort ? "Pending Abort..." : undefined
							}
						/>
						{!pendingAbort &&
							getFacebookGroupCrawlerStatusQuery.data
								?.browserRunning && (
								<Button
									size="sm"
									onClick={() => {
										mutation.mutate();
									}}
								>
									Abort
								</Button>
							)}
						{getFacebookGroupCrawlerTaskByIdQuery.data &&
							getFacebookGroupCrawlerTaskByIdQuery.data.records.filter(
								(record) => {
									return record.status === "SUCCESS";
								}
							).length <
								getFacebookGroupCrawlerTaskByIdQuery.data
									.sourceLength &&
							!getFacebookGroupCrawlerStatusQuery.data
								?.browserRunning && (
								<Button
									size="sm"
									onClick={() => {
										recrawlFailedRecordsMutation.mutate();
									}}
								>
									Retry failed records
								</Button>
							)}
					</div>
				}
			></PageBlock>
			<div
				className="w-full h-1
				border-[1px] border-white/10 overflow-hidden rounded"
			>
				{getFacebookGroupCrawlerTaskByIdQuery.data && (
					<HorizontalProgress
						progress={
							(getFacebookGroupCrawlerTaskByIdQuery.data.records.filter(
								(record) => {
									return record.status === "SUCCESS";
								}
							).length /
								getFacebookGroupCrawlerTaskByIdQuery.data
									.sourceLength) *
							100
						}
					/>
				)}
			</div>
			<PageBlock title="Records">
				<Table>
					<Thead>
						<tr>
							<th className="w-[10%]">Excel Row</th>
							<th className="w-[30%]">Group Address</th>
							<th className="w-[40%]">Group Name</th>
							<th className="w-[10%]">Member Count</th>
							<th className="w-[10%]">Monthly Post Count</th>
						</tr>
					</Thead>
					<Tbody>
						{/* sort by excel row */}
						{getFacebookGroupCrawlerTaskByIdQuery.data &&
							[
								...getFacebookGroupCrawlerTaskByIdQuery.data
									.records,
							]
								.sort((a, b) => {
									return a.excelRow - b.excelRow;
								})
								.map((record, i: number) => {
									return (
										<tr
											key={record.id}
											className={`${
												record.status !== "SUCCESS" &&
												"text-white/20"
											}
											border-t-[1px] border-white/10`}
										>
											<td>{record.excelRow}</td>
											<td>
												<Link
													href={record.groupAddress}
													className="underline hover:text-white/70"
												>
													{record.groupAddress}
												</Link>
											</td>
											<td>{record.groupName}</td>
											<td>{record.memberCount}</td>
											<td>{record.monthlyPostCount}</td>
										</tr>
									);
								})}
					</Tbody>
				</Table>
			</PageBlock>
		</PageContainer>
	);
};
