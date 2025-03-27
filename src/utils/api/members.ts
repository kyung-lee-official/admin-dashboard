import axios, { AxiosError } from "axios";
import { CreateMemberDto } from "../types/internal";

export enum MembersQK {
	GET_MY_MEMBER_PERMISSIONS = "get-my-member-permissions",
	GET_MY_INFO = "get-my-info",
	GET_AVATAR_BY_ID = "get-avatar-by-id",
	GET_MEMBERS = "get-members",
}

export const getPermissions = async (jwt: string): Promise<any> => {
	const res = await axios.get("/internal/members/permissions", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

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
	const res = await axios.post("/internal/members/search", null, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const createMember = async (dto: CreateMemberDto, jwt: string) => {
	const res = await axios.post("/internal/members/create", dto, {
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
