import axios from "axios";

export const createRole = async (accessToken?: string | null): Promise<any> => {
	const res = await axios.post(
		"/member-roles",
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
	const res = await axios.post(
		"/member-roles/find",
		{ roleIds: [] },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: accessToken,
			},
		}
	);
	return res.data;
};

export const updateRoleById = async (
	body: any,
	roleId: number,
	accessToken?: string | null
): Promise<any> => {
	const res = await axios.patch(`/member-roles/${roleId}`, body, {
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
	const res = await axios.delete(`/member-roles/${roleId}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: accessToken,
		},
	});
	return res.data;
};
