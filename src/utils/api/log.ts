import axios from "axios";

export enum LogQK {
	GET_LOGS = "get-logs",
}

export const getLogs = async (page: number, jwt: string) => {
	const res = await axios.get(`/internal/log/${page}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};
