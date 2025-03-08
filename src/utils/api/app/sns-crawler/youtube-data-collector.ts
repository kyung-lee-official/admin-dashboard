import {
	YoutubeDataOverwriteSourceDto,
	YouTubeDataSearchDto,
	YouTubeDataUpdateTokenStateDto,
} from "@/utils/types/app/sns-crawler";
import axios from "axios";

export enum SnsYouTubeDataQK {
	GET_YOUTUBE_TOKENS = "get-youtube-tokens",
	GET_YOUTUBE_SOURCE_DATA = "get-youtube-source-data",
	GET_YOUTUBE_TASKS = "get-youtube-tasks",
	GET_YOUTUBE_TASK_BY_ID = "get-youtube-task-by-id",
	GET_YOUTUBE_TASK_KEYWORD_BY_ID = "get-youtube-task-keyword-by-id",
	GET_YOUTUBE_SEARCHES_BY_TASK_ID_AND_KEYWORD = "get-youtube-searches-by-task-id-and-keyword",
	GET_YOUTUBE_TASK_META = "get-youtube-task-meta",
}

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

// export const updateTaskKeywordSearchesById = async (
// 	dto: UpdateTaskKeywordSearchesByIdDto,
// 	jwt: string
// ) => {
// 	const res = await axios.patch(
// 		`internal/applications/youtube-data-collector/update-task-keyword-searches-by-id`,
// 		dto,
// 		{
// 			baseURL: process.env.NEXT_PUBLIC_API_HOST,
// 			headers: {
// 				Authorization: jwt,
// 			},
// 		}
// 	);
// 	return res.data;
// };
