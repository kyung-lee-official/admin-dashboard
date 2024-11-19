import axios from "axios";
import qs from "qs";

export const getIsSeeded = async (): Promise<any> => {
	const query = qs.stringify({}, { encodeValuesOnly: true });
	const res = await axios.get("/internal/server/is-seeded", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const getServerSettings = async (
	jwt: string | null | undefined
): Promise<{ isSignUpAvailable: boolean }> => {
	const res = await axios.get("/internal/server/settings", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const updateServerSettings = async (
	body: any,
	jwt: string | null | undefined
): Promise<any> => {
	const res = await axios.patch("/internal/server/settings", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getIsSignUpAvailable = async (): Promise<{
	isSignUpAvailable: boolean;
}> => {
	const res = await axios.get("/internal/server/is-sign-up-available", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};
