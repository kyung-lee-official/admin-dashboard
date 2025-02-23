"use client";

import { useAuthStore } from "@/stores/auth";
import {
	getFacebookGroupCrawlerTaskById,
	getFacebookGroupCrawlerTasks,
	SnsCrawlerQK,
} from "@/utils/api/app/sns-crawler";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";

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
		refetchOnWindowFocus: false,
	});

	console.log(getFacebookGroupCrawlerTaskByIdQuery.data);

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex items-center px-6 py-4">
					<div className="text-lg font-semibold">
						Crawler Task {taskId}
					</div>
				</div>
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
						<tr className="w-full">
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
									<tr key={i}>
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
