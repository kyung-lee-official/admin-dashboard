import {
	CreateEventDto,
	SearchStatDto,
	UpdateApprovalDto,
	UpdateEventDto,
} from "@/utils/types/app/performance";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

export enum PerformanceQK {
	GET_MY_STAT_PERMISSIONS = "get-my-stat-permissions",
	GET_STAT_BY_ID = "get-stat-by-id",
	SEARCH_STATS = "search-stats",
	GET_MY_SECTION_PERMISSIONS = "get-my-section-permissions",
	GET_SECTION_BY_ID = "get-section-by-id",
	GET_MY_TEMPLATE_PERMISSIONS = "get-my-template-permissions",
	GET_TEMPLATES_BY_ROLE_ID = "get-templates-by-role-id",
	GET_TEMPLATES_BY_SECTION_ROLE_ID = "get-templates-by-section-role-id",
	GET_TEMPLATE_BY_ID = "get-template-by-id",
	GET_MY_PERMISSION_OF_EVENT = "get-my-permission-of-event",
	GET_EVENT_BY_ID = "get-event-by-id",
	GET_APPROVAL_PERMISSIONS = "get-approval-permissions",
	GET_ATTACHMENT_LIST = "get-attachment-list",
	GET_ATTACHMENT = "get-attachment",
}

export const getMyPermissionOfStat = async (
	statId: number,
	jwt: string
): Promise<any> => {
	const res = await axios.get(
		`/internal/performance/stats/permissions/${statId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const createStat = async (newData: any, jwt: string) => {
	const res = await axios.post("/internal/performance/stats", newData, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const updateStat = async (id: number, newData: any, jwt: string) => {
	const res = await axios.patch(`/internal/performance/stats/${id}`, newData, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const searchStats = async (
	searchStatDto: SearchStatDto,
	jwt: string
) => {
	const res = await axios.post("/internal/performance/stats/search", searchStatDto, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getStatById = async (id: number, jwt: string) => {
	const res = await axios.get(`/internal/performance/stats/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const deleteStatById = async (id: number, jwt: string) => {
	const res = await axios.delete(`/internal/performance/stats/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getMySectionPermissions = async (
	sectionId: number,
	jwt: string
): Promise<any> => {
	const res = await axios.get(
		`/internal/performance/sections/permissions/${sectionId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const addSection = async (newData: any, jwt: string) => {
	const res = await axios.post(`/internal/performance/sections`, newData, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getSectionById = async (id: number, jwt: string) => {
	const res = await axios.get(`/internal/performance/sections/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const updateSectionById = async (newData: any, jwt: string) => {
	const res = await axios.patch(`/internal/performance/sections`, newData, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const deleteSectionById = async (id: number, jwt: string) => {
	const res = await axios.delete(`/internal/performance/sections/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getTemplatePermissions = async (
	templateId: number,
	jwt: string
): Promise<any> => {
	const res = await axios.get(
		`/internal/performance/event-templates/permissions/${templateId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const createTemplate = async (newData: any, jwt: string) => {
	const res = await axios.post(
		"/internal/performance/event-templates",
		newData,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getTemplatesByRoleId = async (roleId: string, jwt: string) => {
	const res = await axios.get(
		`/internal/performance/event-templates/get-by-role-id/${roleId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getTemplateById = async (id: string, jwt: string) => {
	const res = await axios.get(
		`/internal/performance/event-templates/get-by-id/${id}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const deleteTemplateById = async (id: string, jwt: string) => {
	const res = await axios.delete(
		`/internal/performance/event-templates/${id}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
};

export const getMyPermissionOfEvent = async (
	eventId: number,
	jwt: string
): Promise<any> => {
	const res = await axios.get(
		`/internal/performance/events/permissions/${eventId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const createEvent = async (body: CreateEventDto, jwt: string) => {
	const res = await axios.post("/internal/performance/events", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getEventById = async (id: number, jwt: string) => {
	const res = await axios.get(`/internal/performance/events/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const updateEventById = async (
	id: number,
	body: UpdateEventDto,
	jwt: string
) => {
	const res = await axios.patch(
		`/internal/performance/events/update-event-by-id/${id}`,
		body,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const deleteEventById = async (id: number, jwt: string) => {
	const res = await axios.delete(`/internal/performance/events/${id}`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const getApprovalPermissions = async (eventId: number, jwt: string) => {
	const res = await axios.get(
		`/internal/performance/events/get-approval-permissions/${eventId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const updateApprovalByEventId = async (
	id: number,
	dto: UpdateApprovalDto,
	jwt: string
) => {
	const res = await axios.patch(
		`/internal/performance/events/update-approval-by-event-id/${id}`,
		dto,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getAttachmentListByEventId = async (id: number, jwt: string) => {
	const res = await axios.get(
		`/internal/performance/events/get-attachment-list-by-event-id/${id}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getAttachment = async (
	id: number,
	filename: string,
	jwt: string
) => {
	const res = await axios.get<Blob>(
		`/internal/performance/events/get-attachment/${id}/${filename}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			responseType: "blob",
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const uploadAttachmentsByEventId = async (
	id: number,
	data: any,
	setProgress: Dispatch<SetStateAction<number>>,
	jwt: string
) => {
	const res = await axios.put(
		`/internal/performance/events/upload-attachments-by-event-id/${id}`,
		data,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
				"Content-Type": "multipart/form-data",
			},
			onUploadProgress: (progressEvent) => {
				const percentCompleted = progressEvent.progress;
				if (percentCompleted) {
					setProgress(percentCompleted);
				}
			},
		}
	);
	return res.data;
};

export const deleteAttachment = async (
	id: number,
	filename: string,
	jwt: string
) => {
	const res = await axios.delete(
		`/internal/performance/events/delete-attachment/${id}/${filename}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};
