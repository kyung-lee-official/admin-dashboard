import * as ExcelJS from "exceljs";
import { getCompositeDataByTaskId } from "@/utils/api/app/sns-crawler/youtube-data-collector";

type Summary = {
	keyword: string;
	totalVideoCount: number;
	totalViewCount: number;
	totalCommentCount: number;
	totalLikeCount: number;
};

type ExportConfig = {
	minChannelSubscriberCount: number;
};

export type CompositeData = {
	keyword: string;
	publishedAt: string;
	videoId: string;
	title: string;
	description: string;
	durationAsSeconds: number;
	viewCount: number;
	likeCount: number;
	favoriteCount: number;
	commentCount: number;
	channelTitle: string;
	channelViewCount: number;
	channelVideoCount: number;
	subscriberCount: number;
};

export async function exportAsXlsx(
	taskId: number,
	config: ExportConfig,
	jwt: string
) {
	const { minChannelSubscriberCount } = config;
	const compositeData = (await getCompositeDataByTaskId(taskId, jwt)).filter(
		(d, i) => {
			return d.subscriberCount >= minChannelSubscriberCount;
		}
	);

	const summary: Summary[] = [];
	for (const c of compositeData) {
		const keyword = c.keyword;
		const existing = summary.find((s) => s.keyword === keyword);
		if (existing) {
			existing.totalVideoCount++;
			existing.totalViewCount += c.viewCount;
			existing.totalCommentCount += c.commentCount;
			existing.totalLikeCount += c.likeCount;
		} else {
			summary.push({
				keyword,
				totalVideoCount: 1,
				totalViewCount: c.viewCount,
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
		{ header: "Total Comment Count", key: "totalCommentCount", width: 20 },
		{ header: "Total Like Count", key: "totalLikeCount", width: 20 },
	];
	for (const s of summary) {
		worksheet.addRow([
			s.keyword,
			s.totalVideoCount,
			s.totalViewCount,
			s.totalCommentCount,
			s.totalLikeCount,
		]);
	}

	for (const chunk of keywordChunks) {
		const worksheet = workbook.addWorksheet(chunk[0].keyword);
		/* add header, set column width */
		worksheet.columns = [
			{ header: "Video ID", key: "videoId", width: 30 },
			{ header: "Title", key: "title", width: 50 },
			{ header: "Description", key: "description", width: 60 },
			{ header: "Published At", key: "publishedAt", width: 20 },
			{ header: "View Count", key: "viewCount", width: 20 },
			{ header: "Like Count", key: "likeCount", width: 20 },
			{ header: "Comment Count", key: "commentCount", width: 20 },
			{ header: "Favorite Count", key: "favoriteCount", width: 20 },
			{ header: "Duration (s)", key: "durationAsSeconds", width: 20 },
			{ header: "Channel Title", key: "channelTitle", width: 20 },
			{
				header: "Channel Subscriber Count",
				key: "channelSubscriberCount",
				width: 20,
			},
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
				v.description,
				new Date(v.publishedAt).toLocaleString(),
				v.viewCount,
				v.likeCount,
				v.commentCount,
				v.favoriteCount,
				v.durationAsSeconds,
				v.channelTitle,
				v.subscriberCount,
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
