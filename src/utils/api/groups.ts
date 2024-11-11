import axios from "axios";

export const createGroup = async (
	jwt?: string | null
): Promise<any> => {
	const res = await axios.post(
		"/member-groups",
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

export const getGroups = async (jwt?: string | null): Promise<any> => {
	const res = await axios.get("/member-groups", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const updateGroupById = async (
	body: any,
	groupId: number,
	jwt?: string | null
): Promise<any> => {
	const res = await axios.patch(`/member-groups/${groupId}`, body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const deleteGroupById = async (
	groupId: number,
	jwt?: string | null
): Promise<any> => {
	const res = await axios.delete(`/member-groups/${groupId}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};
