import axios from "axios";
import qs from "qs";

export enum ServerSettingQK {
	IS_SEEDED = "is-seeded",
	GET_MY_SERVER_PERMISSIONS = "get-my-server-permissions",
	GET_SERVER_SETTINGS = "get-server-settings",
	GET_IS_SIGN_UP_AVAILABLE = "get-is-sign-up-available",
}

export const seed = async (body: {
	email: string;
	name: string;
	password: string;
}): Promise<any> => {
	const res = await axios.post("/internal/server/seed", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const getPermissions = async (jwt: string): Promise<any> => {
	const query = qs.stringify({}, { encodeValuesOnly: true });
	const res = await axios.get("/internal/server/permissions", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getIsSeeded = async (): Promise<any> => {
	const query = qs.stringify({}, { encodeValuesOnly: true });
	const res = await axios.get("/internal/server/is-seeded", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const getServerSettings = async (
	jwt: string
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
	jwt: string
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
