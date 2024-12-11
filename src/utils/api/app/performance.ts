import axios from "axios";

export const createStat = async (newData: any, jwt: string) => {
	const res = await axios.post("/performance/stats", newData, {
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
