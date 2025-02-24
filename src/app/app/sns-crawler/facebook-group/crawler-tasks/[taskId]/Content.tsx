"use client";

import { Button } from "@/components/button/Button";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { ExportIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import {
	abortFacebookGroupCrawler,
	getFacebookGroupCrawlerTaskById,
	SnsCrawlerQK,
} from "@/utils/api/app/sns-crawler";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as ExcelJS from "exceljs";

export const Content = (props: { taskId: number }) => {
	const { taskId } = props;
	const jwt = useAuthStore((state) => state.jwt);

	const getFacebookGroupCrawlerTaskByIdQuery = useQuery<any, AxiosError>({
		queryKey: [SnsCrawlerQK.GET_FACEBOOK_GROUP_CRAWLER_TASK_BY_ID, jwt],
		queryFn: async () => {
			const facebookGroupSourceData =
				await getFacebookGroupCrawlerTaskById(taskId, jwt);
			return facebookGroupSourceData;
		},
		retry: false,
		refetchInterval: 2000,
	});

	const mutation = useMutation({
		mutationFn: () => {
			return abortFacebookGroupCrawler(jwt);
		},
		onSuccess: () => {},
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
				worksheet.addRow([
					record.groupAddress,
					record.groupName,
					record.memberCount,
					record.monthlyPostCount,
				]);
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
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div
						className="flex items-center gap-4
						text-lg font-semibold"
					>
						<div>Crawler Task {taskId}</div>
						{getFacebookGroupCrawlerTaskByIdQuery.data?.running &&
						getFacebookGroupCrawlerTaskByIdQuery.data?.taskId ===
							taskId ? (
							<div className="flex items-center gap-4">
								<div
									className="w-2.5 h-2.5
									bg-green-500
									rounded-full border-1 border-green-500"
								></div>
								<Button
									size="sm"
									onClick={() => {
										mutation.mutate();
									}}
								>
									Abort
								</Button>
							</div>
						) : (
							<div
								className="w-2.5 h-2.5
								rounded-full border-1 border-white/30"
							></div>
						)}
					</div>
					<TitleMoreMenu
						items={[
							{
								text: "Export as xlsx",
								hideMenuOnClick: true,
								icon: <ExportIcon size={15} />,
								onClick: () => {
									exportAsXlsx();
								},
							},
						]}
					/>
				</div>
			</div>
			<div
				className="w-full h-1.5
				rounded
				border-[1px] border-white/10 overflow-hidden"
			>
				{getFacebookGroupCrawlerTaskByIdQuery.data && (
					<div
						style={{
							width: `${
								(getFacebookGroupCrawlerTaskByIdQuery.data
									.records.length /
									getFacebookGroupCrawlerTaskByIdQuery.data
										.sourceLength) *
								100
							}%`,
						}}
						className={`h-1.5
						bg-white/70 duration-200`}
					></div>
				)}
			</div>
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex items-center px-6 py-4">
					<div>Records</div>
				</div>
				<table
					className="w-full
					text-white/50
					[&_>_thead_>_tr_>_th]:px-6 [&_>_thead_>_tr_>_th]:py-3 [&_>_thead_>_tr_>_th]:text-left
					[&_>_tbody_>_tr_>_td]:px-6 [&_>_tbody_>_tr_>_td]:py-3"
				>
					<thead>
						<tr
							className="w-full
							border-t-[1px] border-white/10"
						>
							<th className="w-2/6">Group Address</th>
							<th className="w-2/6">Group Name</th>
							<th className="w-1/6">Member Count</th>
							<th className="w-1/6">Monthly Post Count</th>
						</tr>
					</thead>
					<tbody>
						{getFacebookGroupCrawlerTaskByIdQuery.data?.records.map(
							(record: any, i: number) => {
								return (
									<tr
										key={i}
										className="border-t-[1px] border-white/10"
									>
										<td>{record.groupAddress}</td>
										<td>{record.groupName}</td>
										<td>{record.memberCount}</td>
										<td>{record.monthlyPostCount}</td>
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
