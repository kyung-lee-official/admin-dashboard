import { CreateEventDto, UpdateEventDto } from "@/utils/types/app/performance";
import axios from "axios";

export enum PerformanceQK {
	GET_STATS = "get-stats",
	GET_STAT_BY_ID = "get-stat-by-id",
	GET_TEMPLATES_BY_ROLE_ID = "get-templates-by-role-id",
	GET_MY_ROLE_TEMPLATES = "get-my-role-templates",
	GET_TEMPLATE_BY_ID = "get-template-by-id",
	GET_EVENT_BY_ID = "get-event-by-id",
}

export const createStat = async (newData: any, jwt: string) => {
	const res = await axios.post("/performance/stats", newData, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const updateStat = async (id: number, newData: any, jwt: string) => {
	const res = await axios.patch(`/performance/stats/${id}`, newData, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getStats = async (memberId: string, jwt: string) => {
	const res = await axios.get("/performance/stats", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getStatById = async (id: number, jwt: string) => {
	const res = await axios.get(`/performance/stats/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const deleteStatById = async (id: number, jwt: string) => {
	const res = await axios.delete(`/performance/stats/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const createTemplate = async (newData: any, jwt: string) => {
	const res = await axios.post("/performance/event-templates", newData, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getTemplatesByRoleId = async (roleId: string, jwt: string) => {
	const res = await axios.get(
		`/performance/event-templates/get-by-role-id/${roleId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getMyRoleTemplates = async (jwt: string) => {
	const res = await axios.get(
		`/performance/event-templates/get-by-my-role-templates`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getTemplateById = async (id: string, jwt: string) => {
	const res = await axios.get(
		`/performance/event-templates/get-by-id/${id}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const createEvent = async (body: CreateEventDto, jwt: string) => {
	const res = await axios.post("/performance/events", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getEventById = async (id: string, jwt: string) => {
	const res = await axios.get(`/performance/events/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const updateEventById = async (
	id: number,
	body: UpdateEventDto,
	jwt: string
) => {
	const res = await axios.patch(
		`/performance/events/update-event-by-id/${id}`,
		body,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const deleteEventById = async (id: number, jwt: string) => {
	const res = await axios.delete(`/performance/events/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};
