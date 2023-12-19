import axios, { AxiosError } from "axios";

export const getMyInfo = async (accessToken?: string | null): Promise<any> => {
	const res = await axios.get("/members/me", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const getUsers = async (accessToken?: string | null): Promise<any> => {
	const res = await axios.get("/members", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const verifyUser = async (
	userId: string,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(
		`/members/member-verification/${userId}`,
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

export const updateProfile = async (
	userId: string,
	nickname: string,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(
		`/members/profile/${userId}`,
		{ nickname: nickname },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: accessToken,
			},
		}
	);
	return res.data;
};

export const changePassword = async (
	userId: string,
	body: { oldPassword: string; newPassword: string; },
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(`/members/password/${userId}`, body, {
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
		"/members/updateAvatar",
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
		`/members/roles/${userId}`,
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
		`/members/groups/${userId}`,
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
		const res = await axios.get(`/members/downloadAvatar/${userId}`, {
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
		`/members/transferOwnership/${userId}`,
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

export const setIsFrozenUserById = async (
	userId: string,
	isFrozen: boolean,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(
		`/members/freeze/${userId}`,
		{
			isFrozen: isFrozen,
		},
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
	const res = await axios.delete(`/members/${userId}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};
