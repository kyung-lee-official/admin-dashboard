import { z } from "zod";

export const overwriteSourceSchema = z.array(
	z.object({
		groupAddress: z
			.string()
			.url()
			.regex(/facebook.com\/groups\/[a-zA-Z0-9\.]+\/*$/g),
		groupName: z.string(),
	})
);

export type FacebookGroupOverwriteSourceDto = z.infer<
	typeof overwriteSourceSchema
>;

export const facebookgroupcrawlSchema = z.object({
	taskId: z.number().int(),
	groupAddress: z
		.string()
		.url()
		.regex(/facebook.com\/groups\/[a-zA-Z0-9\.]+$/g),
	groupName: z.string(),
	memberCount: z.number().int(),
	monthlyPostCount: z.number().int(),
});

export type FacebookGroupCrawlRes = z.infer<typeof facebookgroupcrawlSchema>;

export type Status = {
	pendingAbort: boolean;
	browserRunning: boolean;
	taskId: number | null;
	crawledDatum?: FacebookGroupCrawlRes;
};

export type Task = {
	id: number;
	sourceLength: number;
	createdAt: Date;
	updatedAt: Date;
	records: {
		groupAddress: string;
		groupName: string;
		id: number;
		memberCount: number;
		monthlyPostCount: number;
		facebookGroupCrawlTaskId: number;
	}[];
};
