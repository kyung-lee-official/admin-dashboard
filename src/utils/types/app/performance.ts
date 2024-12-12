export type CreateSectionData = {
	weight: number;
	title: string;
	description?: string;
};

export type CreatePerformanceStatData = {
	ownerId: string;
	month: Date;
	statSections: CreateSectionData[];
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
