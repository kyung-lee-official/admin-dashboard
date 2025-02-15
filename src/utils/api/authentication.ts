import axios from "axios";

export enum AuthenticationQK {
	GET_IS_SIGNED_IN = "get-is-signed-in",
	GET_TENCENT_COS_TEMP_CREDENTIAL = "get-tencent-cos-temp-credential",
	REFRESH_JWT = "refresh-jwt",
}

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
	const res = await axios.post("/authentication/sign-up", body, {
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

export const changePassword = async (
	body: { oldPassword: string; newPassword: string },
	jwt: string
) => {
	const res = await axios.patch(`/authentication/my-password`, body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const resetPassword = async (body: {
	password: string;
	resetPasswordToken: string | null;
}): Promise<any> => {
	const res = await axios.post(`/authentication/reset-password`, body, {
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
