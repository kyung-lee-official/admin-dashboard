import axios from "axios";
import qs from "qs";
import { UpdateRoleByIdDto } from "../types/internal";

export enum RolesQK {
	GET_MY_ROLE_PERMISSIONS = "get-my-role-permissions",
	GET_ALL_ROLES = "get-all-roles",
	GET_MY_ROLE_AND_SUB_ROLES = "get-my-role-and-sub-roles",
	GET_MY_SUB_ROLES = "get-my-sub-roles",
	GET_ROLES_BY_IDS = "get-roles-by-ids",
	GET_ROLE_BY_ID = "get-role-by-id",
}

export const getPermissions = async (jwt: string): Promise<any> => {
	const query = qs.stringify({}, { encodeValuesOnly: true });
	const res = await axios.get("/internal/roles/permissions", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const createRole = async (body: any, jwt: string): Promise<any> => {
	const res = await axios.post(
		"/internal/roles",
		{
			id: body.id,
			name: body.name,
			superRoleId: body.superRoleId,
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

export const getAllRoles = async (jwt: string) => {
	const res = await axios.get("/internal/roles", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getMyRoleAndSubRoles = async (jwt: string): Promise<any> => {
	const res = await axios.get("/internal/roles/my-role-and-sub-roles", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getMySubRoles = async (jwt: string): Promise<any> => {
	const res = await axios.get("/internal/roles/my-sub-roles", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getRolesByIds = async (
	jwt: string,
	ids: string[]
): Promise<any> => {
	const res = await axios.post(
		"/internal/roles/find-roles-by-ids",
		{ roleIds: ids },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getRoleById = async (jwt: string, id: string): Promise<any> => {
	const res = await axios.get(`/internal/roles/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const updateRoleById = async (
	dto: UpdateRoleByIdDto,
	jwt: string
): Promise<any> => {
	const res = await axios.patch(`/internal/roles`, dto, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const deleteRoleById = async (
	roleId: string,
	jwt: string
): Promise<any> => {
	const res = await axios.delete(`/internal/roles/${roleId}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};
