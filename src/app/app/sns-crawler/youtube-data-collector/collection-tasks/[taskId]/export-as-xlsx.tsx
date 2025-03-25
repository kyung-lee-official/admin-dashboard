import * as ExcelJS from "exceljs";
import { getCompositeDataByTaskId } from "@/utils/api/app/sns-crawler/youtube-data-collector";
import { z } from "zod";

type Summary = {
	keyword: string;
	excelRow: number;
	totalVideoCount: number;
	totalViewCount: number;
	totalVideoCountLong: number;
	totalViewCountLong: number;
	totalVideoCountShort: number;
	totalViewCountShort: number;
	totalCommentCount: number;
	totalLikeCount: number;
};

type ExportConfig = {
	minChannelSubscriberCount: number;
	longVideoDurationThreshold: number;
};

const compositeDataSchema = z.object({
	keyword: z.string(),
	excelRow: z.number(),
	publishedAt: z.string(),
	videoId: z.string(),
	title: z.string(),
	description: z.string(),
	durationAsSeconds: z.number(),
	viewCount: z.number(),
	likeCount: z.number(),
	favoriteCount: z.number(),
	commentCount: z.number(),
	channelTitle: z.string(),
	channelViewCount: z.number(),
	channelVideoCount: z.number(),
	subscriberCount: z.number(),
});
export type CompositeData = z.infer<typeof compositeDataSchema>;

export async function exportAsXlsx(
	taskId: number,
	config: ExportConfig,
	jwt: string
) {
	const { minChannelSubscriberCount, longVideoDurationThreshold } = config;
	const compositeData = (await getCompositeDataByTaskId(taskId, jwt)).filter(
		(d, i) => {
			return d.subscriberCount >= minChannelSubscriberCount;
		}
	);

	const summary: Summary[] = [];
	for (const c of compositeData) {
		/* validate the data, drop it if it's invalid */
		try {
			compositeDataSchema.parse(c);
		} catch (e) {
			console.error(`video ${c.videoId} is invalid`);
			continue;
		}
		const keyword = c.keyword;
		const excelRow = c.excelRow;
		const existing = summary.find((s) => s.keyword === keyword);
		if (existing) {
			existing.totalVideoCount++;
			existing.totalViewCount += c.viewCount;
			existing.totalVideoCountLong +=
				c.durationAsSeconds >= longVideoDurationThreshold ? 1 : 0;
			existing.totalViewCountLong +=
				c.durationAsSeconds >= longVideoDurationThreshold
					? c.viewCount
					: 0;
			existing.totalVideoCountShort +=
				c.durationAsSeconds < longVideoDurationThreshold ? 1 : 0;
			existing.totalViewCountShort +=
				c.durationAsSeconds < longVideoDurationThreshold
					? c.viewCount
					: 0;
			existing.totalCommentCount += c.commentCount;
			existing.totalLikeCount += c.likeCount;
		} else {
			summary.push({
				keyword,
				excelRow,
				totalVideoCount: 1,
				totalViewCount: c.viewCount,
				totalVideoCountLong:
					c.durationAsSeconds >= longVideoDurationThreshold ? 1 : 0,
				totalViewCountLong:
					c.durationAsSeconds >= longVideoDurationThreshold
						? c.viewCount
						: 0,
				totalVideoCountShort:
					c.durationAsSeconds < longVideoDurationThreshold ? 1 : 0,
				totalViewCountShort:
					c.durationAsSeconds < longVideoDurationThreshold
						? c.viewCount
						: 0,
				totalCommentCount: c.commentCount,
				totalLikeCount: c.likeCount,
			});
		}
	}

	const keywordChunks: CompositeData[][] = [];
	for (const c of compositeData) {
		const existing = keywordChunks.find((chunk) => {
			if (chunk.length === 0) {
				return false;
			} else {
				return chunk[0].keyword === c.keyword;
			}
		});
		if (existing) {
			existing.push(c);
		} else {
			keywordChunks.push([c]);
		}
	}

	/* export xlsx */
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("Sheet1");
	/* add header, set column width */
	worksheet.columns = [
		{ header: "Keyword", key: "keyword", width: 40 },
		{ header: "Total Video Count", key: "totalVideoCount", width: 20 },
		{ header: "Total View Count", key: "totalViewCount", width: 20 },
		{
			header: "Total Video Count (Long)",
			key: "totalVideoCountLong",
			width: 30,
		},
		{
			header: "Total View Count (Long)",
			key: "totalViewCountLong",
			width: 30,
		},
		{
			header: "Total Video Count (Short)",
			key: "totalVideoCountShort",
			width: 30,
		},
		{
			header: "Total View Count (Short)",
			key: "totalViewCountShort",
			width: 30,
		},
		{ header: "Total Comment Count", key: "totalCommentCount", width: 25 },
		{ header: "Total Like Count", key: "totalLikeCount", width: 20 },
	];
	for (const s of summary) {
		worksheet.getRow(s.excelRow + 1).values = [
			s.keyword,
			s.totalVideoCount,
			s.totalViewCount,
			s.totalVideoCountLong,
			s.totalViewCountLong,
			s.totalVideoCountShort,
			s.totalViewCountShort,
			s.totalCommentCount,
			s.totalLikeCount,
		];
	}

	for (const chunk of keywordChunks) {
		const worksheet = workbook.addWorksheet(chunk[0].keyword);
		/* add header, set column width */
		worksheet.columns = [
			{ header: "Video ID", key: "videoId", width: 30 },
			{ header: "Title", key: "title", width: 50 },
			{ header: "Channel Title", key: "channelTitle", width: 20 },
			{ header: "View Count", key: "viewCount", width: 20 },
			{ header: "Like Count", key: "likeCount", width: 20 },
			{ header: "Comment Count", key: "commentCount", width: 20 },
			{ header: "Published At", key: "publishedAt", width: 20 },
			{ header: "Description", key: "description", width: 60 },
			{
				header: "Channel Subscriber Count",
				key: "channelSubscriberCount",
				width: 30,
			},
			{ header: "Favorite Count", key: "favoriteCount", width: 20 },
			{ header: "Duration (s)", key: "durationAsSeconds", width: 20 },
		];
		for (const v of chunk) {
			worksheet.addRow([
				/* id as link */
				{
					text: v.videoId,
					hyperlink: `https://www.youtube.com/watch?v=${v.videoId}`,
					// style: {
					// 	font: {
					// 		underline: true,
					// 		color: { argb: "FF0000FF" },
					// 	},
					// },
				},
				v.title,
				v.channelTitle,
				v.viewCount,
				v.likeCount,
				v.commentCount,
				new Date(v.publishedAt).toLocaleString(),
				v.description,
				v.subscriberCount,
				v.favoriteCount,
				v.durationAsSeconds,
			]);
		}
	}

	/* create blob from the workbook */
	const buffer = await workbook.xlsx.writeBuffer();
	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	/* create a download link and trigger the download */
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `youtube-data-collection-task-${taskId}.xlsx`;
	a.click();
	window.URL.revokeObjectURL(url);
}
