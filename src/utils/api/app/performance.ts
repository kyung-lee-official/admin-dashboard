import axios from "axios";

export enum PerformanceQK {
	GET_PERFORMANCE_STATS = "get-performance-stats",
	GET_PERFORMANCE_STAT_BY_ID = "get-performance-stat-by-id",
	GET_PERFORMANCE_TEMPLATES = "get-performance-templates",
	GET_PERFORMANCE_TEMPLATE_BY_ID = "get-performance-template-by-id",
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

export const getTemplatesByRole = async (roleId: string, jwt: string) => {
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
