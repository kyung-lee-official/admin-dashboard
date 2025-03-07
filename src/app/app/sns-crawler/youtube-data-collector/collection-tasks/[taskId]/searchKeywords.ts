import { YouTubeDataTaskKeyword } from "@/utils/types/app/sns-crawler";
import dayjs from "dayjs";
import { searchKeyword } from "./searchKeyword";
import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import {
	SnsYouTubeDataQK,
	updateTaskKeywordSearchesById,
	updateTokenState,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";

export const searchKeywords = async (
	youtubeToken: string,
	youTubeDataTaskKeywords: YouTubeDataTaskKeyword[],
	start: dayjs.Dayjs,
	end: dayjs.Dayjs,
	targetResultCount: number
) => {
	const jwt = useAuthStore((state) => state.jwt);

	for (const k of youTubeDataTaskKeywords) {
		try {
			const results = await searchKeyword(
				youtubeToken,
				k.keyword,
				start.toISOString(),
				end.toISOString(),
				targetResultCount
			);
			const keyword = updateTaskKeywordSearchesById(
				{
					id: k.id,
					searches: results.map((r) => {
						return {
							keyword: k.keyword,
							id: r.videoId,
							publishedAt: r.publishedAt,
							channelId: r.channelId,
						};
					}),
				},
				jwt
			);
			// const youtubeDataTaskKeyword =
			// 	await this.prismaService.youTubeDataTaskKeyword.update({
			// 		where: {
			// 			id: k.id,
			// 		},
			// 		data: {
			// 			pending: false,
			// 			failed: false,
			// 			searchs: {
			// 				create: results.map((r) => {
			// 					return {
			// 						keyword: k.keyword,
			// 						id: r.videoId,
			// 						publishedAt: r.publishedAt,
			// 						channelId: r.channelId,
			// 					};
			// 				}),
			// 			},
			// 		},
			// 	});
		} catch (error: any) {
			console.error(`an error occurred when searching for ${k.keyword}`);
			console.error(error);
			if (
				error.response.data.error.errors[0].reason === "quotaExceeded"
			) {
				await updateTokenState(
					{
						oldToken: youtubeToken,
					},
					jwt
				);
				queryClient.invalidateQueries({
					queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TOKENS],
				});
			}
			await this.prismaService.youTubeDataTaskKeyword.update({
				where: {
					id: k.id,
				},
				data: {
					failed: true,
				},
			});
			continue;
		}
	}
	return await this.prismaService.youTubeDataTaskKeyword.findUnique({
		where: {
			id: taskId,
		},
		include: {
			searchs: true,
		},
	});
};
