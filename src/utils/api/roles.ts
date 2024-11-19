import axios from "axios";

export const createRole = async (jwt?: string | null): Promise<any> => {
	const res = await axios.post(
		"/internal/roles",
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

export const getRoles = async (jwt?: string | null): Promise<any> => {
	const res = await axios.post(
		"/internal/roles/find-roles-by-ids",
		{ roleIds: [] },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const updateRoleById = async (
	body: any,
	roleId: number,
	jwt?: string | null
): Promise<any> => {
	const res = await axios.patch(`/internal/roles/${roleId}`, body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const deleteRoleById = async (
	roleId: number,
	jwt?: string | null
): Promise<any> => {
	const res = await axios.delete(`/internal/roles/${roleId}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};
