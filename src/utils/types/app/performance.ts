import { z } from "zod";
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
	templateId?: number;
	templateScore?: number;
	templateDescription?: string;
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

const updateEventDtoSchema = z.object({
	score: z.number(),
	/* amount can only be added after the event is created, default is 1 */
	amount: z.number().optional(),
	description: z.string(),
	/* attachments can only be added after the event is created */
	// attachments: z.array(z.string()),
});

export type UpdateEventDto = z.infer<typeof updateEventDtoSchema>;
