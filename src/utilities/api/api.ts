import dayjs from "dayjs";
import axios, { AxiosError } from "axios";
import qs from "qs";
import COS from "cos-js-sdk-v5";

/* ======== Server Settings ======== */

export const getServerSettings = async (
	accessToken: string | null | undefined
): Promise<{ isSignUpAvailable: boolean }> => {
	const res = await axios.get("/server-settings", {
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
	const res = await axios.patch("/server-settings", body, {
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
	const res = await axios.get("/server-settings/isSignUpAvailable", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

/* ======== Auth ======== */

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

/* ======== Users ======== */

export const getMyInfo = async (accessToken?: string | null): Promise<any> => {
	const res = await axios.get("/users/me", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const getUsers = async (accessToken?: string | null): Promise<any> => {
	const res = await axios.get("/users", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const changePassword = async (
	userId: string,
	body: { oldPassword: string; newPassword: string },
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(`/users/password/${userId}`, body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const uploadMyAvatar = async (
	blob: Blob,
	accessToken?: string | null
) => {
	const fileFromBlob = new File([blob], "avatar.png", { type: "image/png" });
	const res = await axios.put(
		"/users/updateAvatar",
		{ file: fileFromBlob },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: accessToken,
				"Content-Type": "multipart/form-data",
			},
		}
	);
	return res;
};

export const editUserRoles = async (
	userId: string,
	roleIds: number[],
	accessToken?: string | null
) => {
	const res = await axios.patch(
		`/users/roles/${userId}`,
		{ roleIds },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: accessToken,
			},
		}
	);
	return res.data;
};

export const editUserGroups = async (
	userId: string,
	groupIds: number[],
	accessToken?: string | null
) => {
	const res = await axios.patch(
		`/users/groups/${userId}`,
		{ groupIds },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: accessToken,
			},
		}
	);
	return res.data;
};

export const downloadAvatar = async (
	userId: string,
	accessToken?: string | null
) => {
	try {
		const res = await axios.get(`/users/downloadAvatar/${userId}`, {
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: accessToken,
			},
			responseType: "blob",
		});
		return res.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			if (error.response!.status === 404) {
				return null;
			} else {
				throw error;
			}
		} else {
			throw error;
		}
	}
};

export const transferOwnership = async (
	userId: string,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(
		`/users/transferOwnership/${userId}`,
		{},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: accessToken,
			},
		}
	);
	return res.data;
};

export const freezeUserById = async (
	userId: string,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(
		`/users/freeze/${userId}`,
		{},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: accessToken,
			},
		}
	);
	return res.data;
};

export const deleteUserById = async (
	userId: string,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.delete(`/users/${userId}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

/* ======== Roles ======== */

export const createRole = async (accessToken?: string | null): Promise<any> => {
	const res = await axios.post(
		"/roles",
		{},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: accessToken,
			},
		}
	);
	return res.data;
};

export const getRoles = async (accessToken?: string | null): Promise<any> => {
	const res = await axios.get("/roles", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const updateRoleById = async (
	body: any,
	roleId: number,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(`/roles/${roleId}`, body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const deleteRoleById = async (
	roleId: number,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.delete(`/roles/${roleId}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

/* ======== Groups ======== */

export const createGroup = async (
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.post(
		"/groups",
		{},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: accessToken,
			},
		}
	);
	return res.data;
};

export const getGroups = async (accessToken?: string | null): Promise<any> => {
	const res = await axios.get("/groups", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const updateGroupById = async (
	body: any,
	groupId: number,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(`/groups/${groupId}`, body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const deleteGroupById = async (
	groupId: number,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.delete(`/groups/${groupId}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

/* ======== CHITUBOX Docs Analytics ======== */

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
