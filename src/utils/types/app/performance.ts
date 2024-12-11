export type Section = {
	weight: number;
	title: string;
	description?: string;
};

export type PerformanceStatData = {
	ownerId: string;
	month: Date;
	statSections: Section[];
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
	statSections: SectionResponse[];
};
