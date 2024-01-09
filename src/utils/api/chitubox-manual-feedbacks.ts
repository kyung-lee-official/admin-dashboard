import dayjs from "dayjs";
import axios, { AxiosError } from "axios";
import qs from "qs";

export const getChituboxManualFeedbacks = async (
	start: dayjs.Dayjs,
	end: dayjs.Dayjs,
	accessToken?: string | null
): Promise<any> => {
	const query = qs.stringify({
		startDate: start.toISOString(),
		endDate: end.toISOString(),
	});
	const res = await axios.get(`/chitubox-manual-feedbacks?${query}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};
