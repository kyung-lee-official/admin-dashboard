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
		id: number;
		groupAddress: string;
		groupName: string;
		failed: boolean;
		memberCount: number;
		monthlyPostCount: number;
		facebookGroupCrawlTaskId: number;
	}[];
};

export const youtubeDataOverwriteSourceSchema = z.array(
	z.object({
		keyword: z.string(),
	})
);

export type YoutubeDataOverwriteSourceDto = z.infer<
	typeof youtubeDataOverwriteSourceSchema
>;

export type YouTubeToken = {
	isRecentlyUsed: boolean;
	quotaRunOutAt: string;
	token: string;
};

export type YouTubeDataTask = {
	id: number;
	youTubeDataTaskKeywords: YouTubeDataTaskKeyword[];
	createdAt: string;
	updatedAt: string;
};

export type YouTubeDataTaskKeyword = {
	id: number;
	keyword: string;
	pending: boolean;
	failed: boolean;
	taskId: number;
};

export const youtubeDataUpdateTokenStateSchema = z.object({
	recentlyUsedToken: z.string().optional(),
	oldToken: z.string().optional(),
});

export type YouTubeDataUpdateTokenStateDto = z.infer<
	typeof youtubeDataUpdateTokenStateSchema
>;

export const updateSearchesByTaskIdSchema = z.object({
	taskId: z.number().int(),
	searches: z.array(
		z.object({
			id: z.string() /* videoId */,
			keyword: z.string(),
			publishedAt: z.string().datetime(),
			channelId: z.string(),
		})
	),
});

export type UpdateSearchesByTaskIdDto = z.infer<
	typeof updateSearchesByTaskIdSchema
>;
