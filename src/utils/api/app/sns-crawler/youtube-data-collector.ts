import { CompositeData } from "@/app/app/sns-crawler/youtube-data-collector/collection-tasks/[taskId]/export-as-xlsx";
import {
	YoutubeDataOverwriteSourceDto,
	YouTubeDataSearchDto,
	YouTubeDataUpdateTokenStateDto,
} from "@/utils/types/app/sns-crawler";
import axios from "axios";

export enum SnsYouTubeDataQK {
	GET_YOUTUBE_PERMISSIONS = "get-youtube-permissions",
	GET_YOUTUBE_TOKENS = "get-youtube-tokens",
	GET_YOUTUBE_SOURCE_DATA = "get-youtube-source-data",
	GET_YOUTUBE_TASKS = "get-youtube-tasks",
	GET_YOUTUBE_TASK_BY_ID = "get-youtube-task-by-id",
	GET_YOUTUBE_TASK_KEYWORD_BY_ID = "get-youtube-task-keyword-by-id",
	GET_YOUTUBE_SEARCHES_BY_TASK_ID_AND_KEYWORD = "get-youtube-searches-by-task-id-and-keyword",
	GET_YOUTUBE_TASK_META = "get-youtube-task-meta",
	GET_YOUTUBE_CHANNELS_BY_TASK_ID = "get-youtube-channels-by-task-id",
	GET_YOUTUBE_VIDEOS_BY_TASK_ID = "get-youtube-videos-by-task-id",
}

export const getPermissions = async (jwt: string) => {
	const res = await axios.get(
		"internal/applications/youtube-data-collector/permissions",
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const addYouTubeToken = async (youtubeToken: string, jwt: string) => {
	const res = await axios.post(
		"internal/applications/youtube-data-collector/token",
		{ token: youtubeToken },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getYouTubeTokens = async (jwt: string) => {
	const res = await axios.get(
		"internal/applications/youtube-data-collector/tokens",
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const updateTokenState = async (
	dto: YouTubeDataUpdateTokenStateDto,
	jwt: string
) => {
	const res = await axios.patch(
		"internal/applications/youtube-data-collector/update-token-state",
		dto,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const deleteToken = async (youtubeToken: string, jwt: string) => {
	const res = await axios.delete(
		`internal/applications/youtube-data-collector/${youtubeToken}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const markTokenAsAvailable = async (
	youtubeToken: string,
	jwt: string
) => {
	const res = await axios.patch(
		`internal/applications/youtube-data-collector/mark-token-as-available/${youtubeToken}`,
		{},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const overwriteYouTubeSourceData = async (
	newData: YoutubeDataOverwriteSourceDto,
	jwt: string
) => {
	const res = await axios.patch(
		"internal/applications/youtube-data-collector/overwrite-source",
		newData,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getYouTubeGroupSourceData = async (jwt: string) => {
	const res = await axios.get(
		"internal/applications/youtube-data-collector/source",
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const createYouTubeTask = async (jwt: string) => {
	const res = await axios.post(
		"internal/applications/youtube-data-collector/create-task",
		{},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getYouTubeTasks = async (jwt: string) => {
	const res = await axios.get(
		"internal/applications/youtube-data-collector/tasks",
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getYouTubeTaskById = async (taskId: number, jwt: string) => {
	const res = await axios.get(
		`internal/applications/youtube-data-collector/get-task-by-id/${taskId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const deleteYouTubeTaskById = async (taskId: number, jwt: string) => {
	const res = await axios.delete(
		`internal/applications/youtube-data-collector/delete-task-by-id/${taskId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const fetchYouTubeChannelsByTaskId = async (
	taskId: number,
	jwt: string
) => {
	const res = await axios.get(
		`internal/applications/youtube-data-collector/fetch-channels-by-task-id/${taskId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getYouTubeChannelsByTaskId = async (
	taskId: number,
	jwt: string
) => {
	const res = await axios.get(
		`internal/applications/youtube-data-collector/get-channels-by-task-id/${taskId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	const parsedData = res.data.map((data: any) => {
		return {
			...data,
			viewCount: parseInt(data.viewCount as string),
			subscriberCount: parseInt(data.subscriberCount as string),
			videoCount: parseInt(data.videoCount as string),
		};
	});
	return parsedData;
};

export const fetchYouTubeVideosByTaskId = async (
	taskId: number,
	jwt: string
) => {
	const res = await axios.get(
		`internal/applications/youtube-data-collector/fetch-videos-by-task-id/${taskId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getYouTubeVideosByTaskId = async (taskId: number, jwt: string) => {
	const res = await axios.get(
		`internal/applications/youtube-data-collector/get-videos-by-task-id/${taskId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	const parsedData = res.data.map((data: any) => {
		return {
			...data,
			viewCount: parseInt(data.viewCount as string),
			likeCount: parseInt(data.likeCount as string),
			favoriteCount: parseInt(data.favoriteCount as string),
			commentCount: parseInt(data.commentCount as string),
		};
	});
	return parsedData;
};

export const getYouTubeTaskMeta = async (jwt: string) => {
	const res = await axios.get(
		"internal/applications/youtube-data-collector/meta",
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getYouTubeDataTaskKeywordById = async (
	keywordId: number,
	jwt: string
) => {
	const res = await axios.get(
		`internal/applications/youtube-data-collector/get-task-keyword-by-id/${keywordId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getSearchesByTaskIdAndKeyword = async (
	{ taskId, keyword }: { taskId: number; keyword: string },
	jwt: string
) => {
	const res = await axios.post(
		"internal/applications/youtube-data-collector/get-searches-by-task-id-and-keyword",
		{
			taskId: taskId,
			keyword: keyword,
		},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const startTaskById = async (
	youtubeDataSearchDto: YouTubeDataSearchDto,
	jwt: string
) => {
	const { taskId, start, end, targetResultCount } = youtubeDataSearchDto;
	const res = await axios.post(
		`internal/applications/youtube-data-collector/start-task-by-id`,
		{
			taskId,
			start,
			end,
			targetResultCount,
		},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getCompositeDataByTaskId = async (
	taskId: number,
	jwt: string
): Promise<CompositeData[]> => {
	const compositeData = await axios.get(
		`internal/applications/youtube-data-collector/get-composite-data-by-task-id/${taskId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	const parsedData = compositeData.data.map((data: any) => {
		return {
			...data,
			viewCount: parseInt(data.viewCount as string),
			likeCount: parseInt(data.likeCount as string),
			favoriteCount: parseInt(data.favoriteCount as string),
			commentCount: parseInt(data.commentCount as string),
			channelViewCount: parseInt(data.channelViewCount as string),
			channelVideoCount: parseInt(data.channelVideoCount as string),
			subscriberCount: parseInt(data.subscriberCount as string),
		};
	});
	return parsedData;
};

export const abortTask = async (jwt: string) => {
	const res = await axios.post(
		`internal/applications/youtube-data-collector/abort-task`,
		{},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};
