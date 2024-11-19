import axios, { AxiosError } from "axios";

export const getMyInfo = async (jwt: string) => {
	const res = await axios.get("/internal/members/me", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getMembers = async (jwt: string) => {
	const res = await axios.post("/internal/members/find", null, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const verifyMember = async (id: string, jwt: string) => {
	const res = await axios.patch(
		`/internal/members/member-verification/${id}`,
		{},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const updateProfile = async (
	newData: {
		id: string;
		name: string;
	},
	jwt: string
) => {
	const res = await axios.patch(
		`/internal/members/${newData.id}/profile`,
		{ name: newData.name },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const uploadMyAvatar = async (blob: Blob, jwt: string) => {
	const fileFromBlob = new File([blob], "avatar.png", { type: "image/png" });
	const res = await axios.put(
		"/internal/members/update-avatar",
		{ file: fileFromBlob },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
				"Content-Type": "multipart/form-data",
			},
		}
	);
	return res;
};

export const editMemberRoles = async (
	id: string,
	roleIds: number[],
	jwt: string
) => {
	const res = await axios.patch(
		`/internal/members/roles/${id}`,
		{ roleIds },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const editMemberGroups = async (
	id: string,
	groupIds: number[],
	jwt: string
) => {
	const res = await axios.patch(
		`/internal/members/groups/${id}`,
		{ groupIds },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const downloadAvatar = async (id: string, jwt: string) => {
	try {
		const res = await axios.get(`/internal/members/download-avatar/${id}`, {
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
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

export const transferOwnership = async (id: string, jwt: string) => {
	const res = await axios.patch(
		`/internal/members/transferOwnership/${id}`,
		{},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const setIsFrozenMemberById = async (
	id: string,
	isFrozen: boolean,
	jwt: string
) => {
	const res = await axios.patch(
		`/internal/members/freeze/${id}`,
		{
			isFrozen: isFrozen,
		},
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const deleteMemberById = async (id: string, jwt: string) => {
	const res = await axios.delete(`/internal/members/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};
