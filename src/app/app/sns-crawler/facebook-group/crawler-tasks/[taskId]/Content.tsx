"use client";

import { useAuthStore } from "@/stores/auth";
import {
	getFacebookGroupCrawlerTaskById,
	SnsCrawlerQK,
} from "@/utils/api/app/sns-crawler";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

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

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex items-center px-6 py-4">
					<div
						className="flex items-center gap-x-4
						text-lg font-semibold"
					>
						<div>Crawler Task {taskId}</div>
						{getFacebookGroupCrawlerTaskByIdQuery.data?.running &&
						getFacebookGroupCrawlerTaskByIdQuery.data?.taskId ===
							taskId ? (
							<div
								className="w-2.5 h-2.5
								bg-green-500
								rounded-full border-1 border-green-500"
							></div>
						) : (
							<div
								className="w-2.5 h-2.5
								rounded-full border-1 border-white/30"
							></div>
						)}
					</div>
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
							<th className="w-1/6">Montrly Post Count</th>
						</tr>
					</thead>
					<tbody>
						{getFacebookGroupCrawlerTaskByIdQuery.data?.records.map(
							(record: any, i: number) => {
								return (
									// <div
									// 	key={i}
									// 	className="flex items-center px-6 py-4 gap-6
									// 	text-sm
									// 	hover:bg-white/5
									// 	border-t-[1px] border-white/10"
									// >
									// 	{record.id}
									// </div>
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
