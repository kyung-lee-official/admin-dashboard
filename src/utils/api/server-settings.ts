import axios from "axios";
import qs from "qs";

export const getIsSeeded = async (): Promise<any> => {
	const query = qs.stringify({}, { encodeValuesOnly: true });
	const res = await axios.get("/server/is-seeded", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const getServerSettings = async (
	accessToken: string | null | undefined
): Promise<{ isSignUpAvailable: boolean }> => {
	const res = await axios.get("/member-server-settings", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const updateServerSettings = async (
	body: any,
	accessToken: string | null | undefined
): Promise<any> => {
	const res = await axios.patch("/member-server-settings", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const getIsSignUpAvailable = async (): Promise<{
	isSignUpAvailable: boolean;
}> => {
	const res = await axios.get("/member-server-settings/isSignUpAvailable", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};
