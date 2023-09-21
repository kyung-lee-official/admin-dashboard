import axios from "axios";
import qs from "qs";

export const getIsSeeded = async (): Promise<any> => {
	const query = qs.stringify({}, { encodeValuesOnly: true });
	const res = await axios.get("/auth/isSeeded", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const seed = async (body: {
	email: string;
	nickname: string;
	password: string;
}): Promise<any> => {
	const res = await axios.post("/auth/seed", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const getIsSignedIn = async (
	accessToken?: string | null
): Promise<{ isSignedIn: true }> => {
	const res = await axios.get("/auth/isSignedIn", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const signIn = async (body: {
	email: string;
	password: string;
}): Promise<any> => {
	const res = await axios.post("/auth/signin", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const signUp = async (body: {
	email: string;
	nickname: string;
	password: string;
}): Promise<any> => {
	const res = await axios.post("/auth/signup", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const refreshAccessToken = async (accessToken?: string | null) => {
	const res = await axios.get("/auth/refreshAccessToken", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const sendVerificationEmail = async (accessToken?: string | null) => {
	const res = await axios.post("/auth/sendVerificationEmail", null, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const verifyEmail = async (body: {
	verificationToken: string;
}): Promise<any> => {
	const res = await axios.post("/auth/verifyEmail", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const forgetPassword = async (body: { email: string }): Promise<any> => {
	const res = await axios.post("/auth/forgetPassword", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const resetPassword = async (body: {
	password: string;
	resetPasswordToken: string | null;
}): Promise<any> => {
	const res = await axios.post(`/auth/resetPassword`, body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const getTencentCosTempCredential = async (
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.get("/auth/tencentCosTempCredential", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};
