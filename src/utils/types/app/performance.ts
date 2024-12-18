import dayjs from "dayjs";
import { Member, MemberRole } from "../internal";

export type CreateSectionData = {
	tempId: string /* a nanoId for new sections, used for distinguishing newly added sections in frontend only, for example, identifying which one to delete */;
	weight: number;
	title: string;
	description?: string;
};

export type CreatePerformanceStatData = {
	member: Member;
	month: dayjs.Dayjs;
	statSections: CreateSectionData[];
};

export type EditSectionData = {
	id?: number /* if id is present, it's an existing section */;
	tempId: string /* a nanoId for new sections, used for distinguishing newly added sections in frontend only, for example, identifying which one to delete */;
	weight: number;
	title: string;
	description?: string;
};

export type EditPerformanceStatData = {
	ownerId: string;
	month: dayjs.Dayjs;
	statSections: EditSectionData[];
};

export type EventResponse = {
	id: number;
	templateId: number;
	templateScore: number;
	templateDescription: string;
	sectionId: number;
	score: number;
	amount: number;
	description: string;
	attachments: [];
};

export type OwnerResponse = {
	id: string;
	email: string;
	name: string;
	isVerified: boolean;
	isFrozen: boolean;
	createdAt: string;
	updatedAt: string;
};

export type SectionResponse = {
	id: number;
	weight: number;
	title: string;
	description?: string;
	events: EventResponse[];
};

export type PerformanceStatResponse = {
	id: number;
	ownerId: string;
	month: string;
	owner: OwnerResponse;
	statSections: SectionResponse[];
};

export type CreatePerformanceEventTemplate = {
	score: number;
	description: string;
	memberRole: MemberRole;
};

export type PerformanceEventTemplateResponse = {
	id: number;
	score: number;
	description: string;
	memberRole: MemberRole;
	createdAt: string;
	updatedAt: string;
};
