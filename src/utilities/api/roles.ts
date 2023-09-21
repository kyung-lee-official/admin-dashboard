import axios from "axios";

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
