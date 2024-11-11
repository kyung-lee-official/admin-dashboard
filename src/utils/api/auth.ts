import axios from "axios";

export const seed = async (body: {
	email: string;
	name: string;
	password: string;
}): Promise<any> => {
	const res = await axios.post("/member-auth/seed", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const getIsSignedIn = async (jwt: string) => {
	const res = await axios.get("/authentication/is-signed-in", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const signIn = async (body: {
	email: string;
	password: string;
}): Promise<any> => {
	const res = await axios.post("/authentication/sign-in", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const signUp = async (body: {
	email: string;
	name: string;
	password: string;
}): Promise<any> => {
	const res = await axios.post("/member-auth/signup", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const refreshJwt = async (jwt: string) => {
	const res = await axios.get("/authentication/refresh-jwt", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const forgetPassword = async (body: { email: string }): Promise<any> => {
	const res = await axios.post("/member-auth/forgetPassword", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const resetPassword = async (body: {
	password: string;
	resetPasswordToken: string | null;
}): Promise<any> => {
	const res = await axios.post(`/member-auth/resetPassword`, body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

/* Tencent COS */

export const getTencentCosTempCredential = async (
	jwt: string
): Promise<any> => {
	const res = await axios.get("/member-auth/tencentCosTempCredential", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

/* Google OAuth2 */

export const googleConsentScreen = () => {
	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
	const options = {
		client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH20_CLIENT_ID as string,
		redirect_uri: process.env
			.NEXT_PUBLIC_GOOGLE_OAUTH20_VANILLA_REDIRECT_URI as string,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
	};
	const qs = new URLSearchParams(options);
	return `${rootUrl}?${qs.toString()}`;
};
