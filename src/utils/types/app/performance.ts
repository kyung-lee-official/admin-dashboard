import { z } from "zod";
import dayjs from "dayjs";
import { Member, MemberRole } from "../internal";

export type CreateSectionData = {
	weight: number;
	memberRole: MemberRole | null;
	title: string;
	description?: string;
};

export type CreatePerformanceStatData = {
	member: Member | undefined;
	month: dayjs.Dayjs;
};

export type EditSectionData = {
	weight: number;
	title: string;
	description: string;
};

export type EventResponse = {
	id: number;
	approval: ApprovalType;
	templateId?: number;
	templateScore?: number;
	templateDescription?: string;
	section: SectionResponse;
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
	stat: PerformanceStatResponse;
	memberRole: MemberRole;
	memberRoleId: string;
	title: string;
	description: string;
	events: EventResponse[];
	createdAt: string;
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
	memberRole: MemberRole | null;
};

export type PerformanceEventTemplateResponse = {
	id: number;
	score: number;
	description: string;
	memberRole: MemberRole;
	createdAt: string;
	updatedAt: string;
};

const createEventDtoSchema = z.object({
	templateId: z.number().optional(),
	sectionId: z.number(),
	score: z.number(),
	/* amount can only be added after the event is created, default is 1 */
	amount: z.number().optional(),
	description: z.string(),
	/* attachments can only be added after the event is created */
	// attachments: z.array(z.string()),
});

export type CreateEventDto = z.infer<typeof createEventDtoSchema>;

export type FindEventByIdResponse = {
	id: number;
	templateId?: number;
	templateScore?: number;
	templateDescription?: string;
	sectionId: number;
	section: SectionResponse;
	score: number;
	amount: number;
	description: string;
	attachments: string[];
};

export const updateEventDtoSchema = z.object({
	score: z.number().min(0),
	/* amount can only be added after the event is created, default is 1 */
	amount: z.number().min(0).optional(),
	description: z.string(),
	/* attachments can only be added after the event is created */
	// attachments: z.array(z.string()),
});

export type UpdateEventDto = z.infer<typeof updateEventDtoSchema>;

export enum ApprovalType {
	PENDING = "PENDING",
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
}

const updateApprovalDtoSchema = z.object({
	approval: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});
export type UpdateApprovalDto = z.infer<typeof updateApprovalDtoSchema>;

export const searchStatDtoSchema = z.object({
	ownerId: z.string(),
	year: z.string().date(),
});
export type SearchStatDto = z.infer<typeof searchStatDtoSchema>;
