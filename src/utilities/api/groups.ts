import axios from "axios";

export const createGroup = async (
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.post(
		"/member-groups",
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
	const res = await axios.get("/member-groups", {
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
	const res = await axios.patch(`/member-groups/${groupId}`, body, {
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
	const res = await axios.delete(`/member-groups/${groupId}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};
