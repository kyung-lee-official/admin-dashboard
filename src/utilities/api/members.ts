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

export const getMembers = async (accessToken?: string | null): Promise<any> => {
	const res = await axios.get("/members", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};

export const verifyMember = async (
	memberId: string,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(
		`/members/member-verification/${memberId}`,
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
	memberId: string,
	nickname: string,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(
		`/members/profile/${memberId}`,
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
	memberId: string,
	body: { oldPassword: string; newPassword: string; },
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(`/members/password/${memberId}`, body, {
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

export const editMemberRoles = async (
	memberId: string,
	roleIds: number[],
	accessToken?: string | null
) => {
	const res = await axios.patch(
		`/members/roles/${memberId}`,
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

export const editMemberGroups = async (
	memberId: string,
	groupIds: number[],
	accessToken?: string | null
) => {
	const res = await axios.patch(
		`/members/groups/${memberId}`,
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
	memberId: string,
	accessToken?: string | null
) => {
	try {
		const res = await axios.get(`/members/downloadAvatar/${memberId}`, {
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
	memberId: string,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(
		`/members/transferOwnership/${memberId}`,
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

export const setIsFrozenMemberById = async (
	memberId: string,
	isFrozen: boolean,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(
		`/members/freeze/${memberId}`,
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

export const deleteMemberById = async (
	memberId: string,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.delete(`/members/${memberId}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};
