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
		status: "PENDING" | "SUCCESS" | "FAILED";
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
	status: "PENDING" | "FAILED" | "SUCCESS";
	taskId: number;
};

export type YouTubeDataTaskChannel = {
	id: number;
	channelId: string;
	channelTitle: string;
	viewCount: number;
	subscriberCount: number;
	videoCount: number;
	youTubeDataTaskId: number;
};

export type YouTubeDataTaskVideo = {
	id: number;
	videoId: string;
	title: string;
	description: string;
	durationAsSeconds: number;
	viewCount: number;
	likeCount: number;
	favoriteCount: number;
	commentCount: number;
	youTubeDataTaskId: number;
};

export const youtubeDataUpdateTokenStateSchema = z.object({
	recentlyUsedToken: z.string().optional(),
	oldToken: z.string().optional(),
});

export type YouTubeDataUpdateTokenStateDto = z.infer<
	typeof youtubeDataUpdateTokenStateSchema
>;

export const youtubeDataSearchSchema = z
	.object({
		taskId: z.number(),
		start: z.string().datetime(),
		end: z.string().datetime(),
		targetResultCount: z.number().int().min(1),
	})
	.refine((data) => data.start < data.end, {
		message: "start date must be before end date",
	});

export type YouTubeDataSearchDto = z.infer<typeof youtubeDataSearchSchema>;
