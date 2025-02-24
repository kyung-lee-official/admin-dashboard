import { FacebookGroupOverwriteSourceDto } from "@/utils/types/app/sns-crawler";
import axios from "axios";

export enum SnsCrawlerQK {
	OVERWRITE_FACEBOOK_GROUP_SOURCE_DATA = "overwrite-facebook-group-source-data",
	GET_FACEBOOK_GROUP_SOURCE_DATA = "get-facebook-group-source-data",
	GET_FACEBOOK_GROUP_CRAWLER_TASKS = "get-facebook-group-crawler-tasks",
	GET_FACEBOOK_GROUP_CRAWLER_TASK_BY_ID = "get-facebook-group-crawler-task-by-id",
	GET_FACEBOOK_GROUP_CRAWLER_STATUS = "get-facebook-group-crawler-status",
}

export const overwriteFacebookGroupSourceData = async (
	newData: FacebookGroupOverwriteSourceDto,
	jwt: string
) => {
	const res = await axios.patch(
		"internal/applications/facebook-group/overwrite-source",
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

export const getFacebookGroupSourceData = async (jwt: string) => {
	const res = await axios.get("internal/applications/facebook-group/source", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const startFacebookGroupCrawler = async (jwt: string) => {
	const res = await axios.post(
		"internal/applications/facebook-group/start-task",
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

export const getFacebookGroupCrawlerTasks = async (jwt: string) => {
	const res = await axios.get("internal/applications/facebook-group/tasks", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getFacebookGroupCrawlerTaskById = async (
	id: number,
	jwt: string
) => {
	const res = await axios.get(
		`internal/applications/facebook-group/task/${id}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getFacebookGroupCrawlerStatus = async (jwt: string) => {
	const res = await axios.get("internal/applications/facebook-group/status", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};
