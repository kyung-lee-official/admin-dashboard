"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
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
		<PageContainer>
			<PageBlock title={`Keyword Id ${keywordId}`}>
				<Table>
					{getYouTubeDataTaskKeywordByIdQuery.data && (
						<Tbody>
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
						</Tbody>
					)}
				</Table>
			</PageBlock>
			<PageBlock
				title={`Videos ${
					getYouTubeSearchesByTaskIdAndKeywordQuery.data &&
					`(${getYouTubeSearchesByTaskIdAndKeywordQuery.data.length})`
				}`}
			>
				<Table>
					{getYouTubeSearchesByTaskIdAndKeywordQuery.data && (
						<Tbody>
							{getYouTubeSearchesByTaskIdAndKeywordQuery.data &&
								getYouTubeSearchesByTaskIdAndKeywordQuery.data.map(
									(video: any, i: number) => {
										return (
											<tr key={video.id}>
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
						</Tbody>
					)}
				</Table>
			</PageBlock>
		</PageContainer>
	);
};
