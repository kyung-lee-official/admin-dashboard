"use client";

import { useAuthStore } from "@/stores/auth";

import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ControlBar } from "./ControlBar";
import {
	YouTubeDataTask,
	YouTubeDataTaskChannel,
	YouTubeDataTaskVideo,
} from "@/utils/types/app/sns-crawler";
import {
	deleteYouTubeTaskById,
	fetchYouTubeChannelsByTaskId,
	fetchYouTubeVideosByTaskId,
	getYouTubeChannelsByTaskId,
	getYouTubeTaskById,
	getYouTubeTaskMeta,
	getYouTubeVideosByTaskId,
	SnsYouTubeDataQK,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";
import { Indicator } from "@/components/indecator/Indicator";
import { Button } from "@/components/button/Button";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { HorizontalProgress } from "@/components/progress/horizontal-progress/HorizontalProgress";
import Link from "next/link";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { Input } from "@/components/input/Input";
import { exportAsXlsx } from "./export-as-xlsx";
import { chunkify } from "@/utils/data/data";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";

export enum TaskStatus {
	IDLE = "idle",
	FETCHING_SEARCHES = "fetching-searches",
	FETCHING_CHANNELS = "fetching-channels",
	FETCHING_VIDEOS = "fetching-videos",
}

export const Content = (props: { taskId: number }) => {
	const { taskId } = props;

	const router = useRouter();
	const searchParams = useSearchParams();
	const channelPage = parseInt(searchParams.get("channel-page") || "1");
	const videoPage = parseInt(searchParams.get("video-page") || "1");
	const updateSearchParams = (
		newChannelPage: number,
		newVideoPage: number
	) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.set("channel-page", newChannelPage.toString());
		newParams.set("video-page", newVideoPage.toString());
		router.push(`?${newParams.toString()}`);
	};
	const handlePrevChannelPage = () => {
		if (channelPage > 1) {
			updateSearchParams(channelPage - 1, videoPage);
		}
	};
	const handleNextChannelPage = () => {
		updateSearchParams(channelPage + 1, videoPage);
	};
	const handlePrevVideoPage = () => {
		if (videoPage > 1) {
			updateSearchParams(channelPage, videoPage - 1);
		}
	};
	const handleNextVideoPage = () => {
		updateSearchParams(channelPage, videoPage + 1);
	};

	const jwt = useAuthStore((state) => state.jwt);
	const getYouTubeTaskByIdQuery = useQuery<YouTubeDataTask>({
		queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TASK_BY_ID],
		queryFn: async () => {
			const youtubeTask = await getYouTubeTaskById(taskId, jwt);
			return youtubeTask;
		},
		refetchInterval: 1000,
		refetchOnWindowFocus: false,
	});

	const getYouTubeChannelsByTaskIdQuery = useQuery<YouTubeDataTaskChannel[]>({
		queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_CHANNELS_BY_TASK_ID],
		queryFn: async () => {
			const youtubeChannels = await getYouTubeChannelsByTaskId(
				taskId,
				jwt
			);
			return youtubeChannels;
		},
		refetchInterval: 1000,
		refetchOnWindowFocus: false,
	});

	const getYouTubeVideosByTaskIdQuery = useQuery<YouTubeDataTaskVideo[]>({
		queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_VIDEOS_BY_TASK_ID],
		queryFn: async () => {
			const youtubeVideos = await getYouTubeVideosByTaskId(taskId, jwt);
			return youtubeVideos;
		},
		refetchInterval: 1000,
		refetchOnWindowFocus: false,
	});

	const getYouTubeTaskMetaQuery = useQuery({
		queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TASK_META],
		queryFn: async () => {
			const youtubeTaskMeta = await getYouTubeTaskMeta(jwt);
			return youtubeTaskMeta;
		},
		refetchInterval: 1000,
		refetchOnWindowFocus: false,
	});

	const [range, setRange] = useState({
		start: dayjs().startOf("month"),
		end: dayjs().endOf("month"),
	});
	const [targetResultCount, setTargetResultCount] = useState(500);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [exportConfig, setExportConfig] = useState({
		minChannelSubscriberCount: 500,
		longVideoDurationThreshold: 120,
	});

	const deleteTaskMutation = useMutation({
		mutationFn: () => {
			return deleteYouTubeTaskById(taskId, jwt);
		},
		onSuccess: () => {
			router.push(
				"/app/sns-crawler/youtube-data-collector/collection-tasks"
			);
		},
		onError: () => {},
	});
	function onDelete() {
		deleteTaskMutation.mutate();
	}

	const fetchChannelsMutation = useMutation({
		mutationFn: () => {
			return fetchYouTubeChannelsByTaskId(taskId, jwt);
		},
		onSuccess: () => {},
		onError: () => {},
	});

	const fetchVideosMutation = useMutation({
		mutationFn: () => {
			return fetchYouTubeVideosByTaskId(taskId, jwt);
		},
		onSuccess: () => {},
		onError: () => {},
	});

	return (
		<PageContainer>
			<PageBlock
				title={`Task ${taskId}`}
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								{
									content: "Delete Task",
									type: "danger",
									hideMenuOnClick: true,
									onClick: () => {
										setShowDeleteConfirmation(true);
									},
								},
							]}
						/>
						<ConfirmDialog
							show={showDeleteConfirmation}
							setShow={setShowDeleteConfirmation}
							question={
								"Are you sure you want to delete this task?"
							}
							onOk={onDelete}
						/>
					</>
				}
			>
				{getYouTubeTaskMetaQuery.data && (
					<ControlBar
						taskId={taskId}
						status={
							getYouTubeTaskMetaQuery.data.status as TaskStatus
						}
						getYouTubeTaskByIdQuery={getYouTubeTaskByIdQuery}
						range={range}
						setRange={setRange}
						targetResultCount={targetResultCount}
						setTargetResultCount={setTargetResultCount}
					/>
				)}
				<div
					className="flex flex-col items-start px-6 py-2 gap-2
					border-t-[1px] border-white/10"
				>
					<div className="flex justify-between w-full">
						<div>Export as XLSX</div>
						<Button
							size="sm"
							onClick={() => {
								exportAsXlsx(taskId, exportConfig, jwt);
							}}
						>
							Export
						</Button>
					</div>
					<div
						className="flex items-center flex-wrap gap-6
						text-white/50"
					>
						<div>
							<div className="text-sm">
								Channel Subs Count Larger Than
							</div>
							<Input
								sz="sm"
								isError={false}
								type="number"
								min={0}
								value={exportConfig.minChannelSubscriberCount}
								onChange={(e) => {
									setExportConfig({
										...exportConfig,
										minChannelSubscriberCount: isNaN(
											parseInt(e.target.value)
										)
											? 0
											: parseInt(e.target.value),
									});
								}}
							/>
						</div>
						<div>
							<div className="text-sm">
								Long Video Duration Threshold (Seconds)
							</div>
							<Input
								sz="sm"
								isError={false}
								type="number"
								min={0}
								value={exportConfig.longVideoDurationThreshold}
								onChange={(e) => {
									setExportConfig({
										...exportConfig,
										longVideoDurationThreshold: isNaN(
											parseInt(e.target.value)
										)
											? 0
											: parseInt(e.target.value),
									});
								}}
							/>
						</div>
					</div>
				</div>
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center">
						<div>YouTube Data Collector Service Status</div>
						<Indicator
							isActive={
								getYouTubeTaskMetaQuery.data?.status !==
								TaskStatus.IDLE
							}
						/>
					</div>
				}
			></PageBlock>
			<PageBlock title="Keywords">
				<HorizontalProgress
					progress={
						getYouTubeTaskByIdQuery.data
							? (getYouTubeTaskByIdQuery.data.youTubeDataTaskKeywords.filter(
									(k) => {
										return k.status === "SUCCESS";
									}
							  ).length /
									getYouTubeTaskByIdQuery.data
										.youTubeDataTaskKeywords.length) *
							  100
							: 0
					}
					borderRadius="rounded-none"
				/>
				<Table>
					<Thead>
						<tr>
							<th>Id</th>
							<th>Excel Row</th>
							<th>Keyword</th>
							<th>Status</th>
						</tr>
					</Thead>
					<Tbody>
						{getYouTubeTaskByIdQuery.data &&
							getYouTubeTaskByIdQuery.data.youTubeDataTaskKeywords.map(
								(k: any, i: number) => {
									return (
										<tr
											key={i}
											className="cursor-pointer"
											onClick={() => {
												router.push(
													`${taskId}/keyword/${k.id}`
												);
											}}
										>
											<td>{k.id}</td>
											<td>{k.excelRow}</td>
											<td>{k.keyword}</td>
											<td>{k.status}</td>
										</tr>
									);
								}
							)}
					</Tbody>
				</Table>
			</PageBlock>
			<PageBlock
				title={
					<div className="flex gap-3">
						<div>Fetch Channel Info Based on Search Results</div>
						{getYouTubeTaskMetaQuery.data?.status ===
							TaskStatus.IDLE && (
							<Button
								size="sm"
								onClick={() => {
									fetchChannelsMutation.mutate();
								}}
							>
								Fetch
							</Button>
						)}
					</div>
				}
			></PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-3">
						<div>Channels</div>
						{getYouTubeChannelsByTaskIdQuery.data && (
							<div>{`(${getYouTubeChannelsByTaskIdQuery.data.length})`}</div>
						)}
					</div>
				}
			>
				<Table>
					<Thead>
						<tr>
							<th>Id</th>
							<th>Channel Id</th>
							<th>Channel Name</th>
							<th>View Count</th>
							<th>Subscriber Count</th>
							<th>Video Count</th>
						</tr>
					</Thead>
					<Tbody>
						{!!getYouTubeChannelsByTaskIdQuery.data?.length &&
							chunkify(getYouTubeChannelsByTaskIdQuery.data, 10)[
								channelPage - 1
							].map((c, i) => {
								return (
									<tr key={i}>
										<td>{c.id}</td>
										<td>{c.channelId}</td>
										<td>{c.channelTitle}</td>
										<td>{c.videoCount}</td>
										<td>{c.subscriberCount}</td>
										<td>{c.videoCount}</td>
									</tr>
								);
							})}
					</Tbody>
				</Table>
				<div
					className="text-white/90
					border-t-[1px] border-white/10 border-t-white/15"
				>
					<div className="flex justify-between px-6 py-4">
						{channelPage === 1 ? (
							<div></div>
						) : (
							<Button size="sm" onClick={handlePrevChannelPage}>
								Prev
							</Button>
						)}
						{!!getYouTubeChannelsByTaskIdQuery.data &&
						getYouTubeChannelsByTaskIdQuery.data.length <=
							channelPage * 10 ? (
							<div></div>
						) : (
							<Button size="sm" onClick={handleNextChannelPage}>
								Next
							</Button>
						)}
					</div>
				</div>
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-3">
						<div>Fetch Video Info Based on Search Results</div>
						{getYouTubeTaskMetaQuery.data?.status ===
							TaskStatus.IDLE && (
							<Button
								size="sm"
								onClick={() => {
									fetchVideosMutation.mutate();
								}}
							>
								Fetch
							</Button>
						)}
					</div>
				}
			></PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-3">
						<div>Videos</div>
						{getYouTubeVideosByTaskIdQuery.data && (
							<div>{`(${getYouTubeVideosByTaskIdQuery.data.length})`}</div>
						)}
					</div>
				}
			>
				<Table>
					<Thead>
						<tr>
							<th>Id</th>
							<th>Video</th>
							<th>Video Title</th>
							<th>Duration as Seconds</th>
							<th>Favorite Count</th>
							<th>Comment Count</th>
						</tr>
					</Thead>
					<Tbody>
						{!!getYouTubeVideosByTaskIdQuery.data?.length &&
							chunkify(getYouTubeVideosByTaskIdQuery.data, 10)[
								videoPage - 1
							].map((v, i) => {
								return (
									<tr
										key={i}
										className="px-3 py-1
										text-sm
										border-t-[1px] border-white/10"
									>
										<td>{v.id}</td>
										<td>
											<Link
												href={`https://www.youtube.com/watch?v=${v.videoId}`}
												className="underline"
											>
												{v.videoId}
											</Link>
										</td>
										<td>{v.title}</td>
										{/* <td>{v.description}</td> */}
										<td>{v.durationAsSeconds}</td>
										<td>{v.favoriteCount}</td>
										<td>{v.commentCount}</td>
									</tr>
								);
							})}
					</Tbody>
				</Table>
				<div
					className="text-white/90
					border-t-[1px] border-white/10 border-t-white/15"
				>
					<div className="flex justify-between px-6 py-4">
						{videoPage === 1 ? (
							<div></div>
						) : (
							<Button size="sm" onClick={handlePrevVideoPage}>
								Prev
							</Button>
						)}
						{!!getYouTubeVideosByTaskIdQuery.data &&
						getYouTubeVideosByTaskIdQuery.data.length <=
							videoPage * 10 ? (
							<div></div>
						) : (
							<Button size="sm" onClick={handleNextVideoPage}>
								Next
							</Button>
						)}
					</div>
				</div>
			</PageBlock>
		</PageContainer>
	);
};
