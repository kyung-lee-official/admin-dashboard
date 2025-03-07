"use client";

import { useAuthStore } from "@/stores/auth";
import {
	getSearchesByTaskIdAndKeyword,
	getYouTubeDataTaskKeywordById,
	SnsYouTubeDataQK,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Content = (props: { taskId: number; keywordId: number }) => {
	const { taskId, keywordId } = props;

	const router = useRouter();
	const jwt = useAuthStore((state) => state.jwt);
	const getYouTubeDataTaskKeywordByIdQuery = useQuery({
		queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TASK_KEYWORD_BY_ID],
		queryFn: async () => {
			const youtubeToken = await getYouTubeDataTaskKeywordById(
				keywordId,
				jwt
			);
			return youtubeToken;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const getYouTubeSearchesByTaskIdAndKeywordQuery = useQuery({
		queryKey: [
			SnsYouTubeDataQK.GET_YOUTUBE_SEARCHES_BY_TASK_ID_AND_KEYWORD,
		],
		queryFn: async () => {
			const youtubeSearches = await getSearchesByTaskIdAndKeyword(
				{
					taskId: taskId,
					keyword: getYouTubeDataTaskKeywordByIdQuery.data.keyword,
				},
				jwt
			);
			return youtubeSearches;
		},
		enabled: !!getYouTubeDataTaskKeywordByIdQuery.data,
		retry: false,
		refetchOnWindowFocus: false,
	});

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">
						Keyword Id {keywordId}
					</div>
				</div>
				<table
					className="w-full
					text-sm text-white/50"
				>
					{getYouTubeDataTaskKeywordByIdQuery.data && (
						<tbody
							className="[&_>_tr_>_td]:px-6 [&_>_tr_>_td]:py-2
							[&_>_tr]:border-t-[1px] [&_>_tr]:border-white/10"
						>
							<tr>
								<td>Keyword</td>
								<td>
									{
										getYouTubeDataTaskKeywordByIdQuery.data
											.keyword
									}
								</td>
							</tr>
							<tr>
								<td>Status</td>
								<td>
									{
										getYouTubeDataTaskKeywordByIdQuery.data
											.status
									}
								</td>
							</tr>
						</tbody>
					)}
				</table>
			</div>
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">
						Videos{" "}
						{getYouTubeSearchesByTaskIdAndKeywordQuery.data &&
							`(${getYouTubeSearchesByTaskIdAndKeywordQuery.data.length})`}
					</div>
				</div>
				<table
					className="w-full
					text-sm text-white/50"
				>
					{getYouTubeSearchesByTaskIdAndKeywordQuery.data && (
						<tbody
							className="[&_>_tr_>_td]:px-6 [&_>_tr_>_td]:py-2
							[&_>_tr]:border-t-[1px] [&_>_tr]:border-white/10"
						>
							{getYouTubeSearchesByTaskIdAndKeywordQuery.data &&
								getYouTubeSearchesByTaskIdAndKeywordQuery.data.map(
									(video: any, i: number) => {
										return (
											<tr key={i}>
												<td>
													<Link
														className="underline"
														href={`https://youtube.com/watch?v=${video.videoId}`}
													>{`https://youtube.com/watch?v=${video.videoId}`}</Link>
												</td>
												<td>{video.publishedAt}</td>
											</tr>
										);
									}
								)}
						</tbody>
					)}
				</table>
			</div>
		</div>
	);
};
