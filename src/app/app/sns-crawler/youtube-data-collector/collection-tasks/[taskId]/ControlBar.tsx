import dayjs from "dayjs";
import { TaskStatus } from "./Content";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/button/Button";
import { DateRangePicker } from "@/components/date/date-range-picker/DateRangePicker";
import { Input } from "@/components/input/Input";
import { useMutation, UseQueryResult } from "@tanstack/react-query";
import {
	abortTask,
	startTaskById,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";
import { useAuthStore } from "@/stores/auth";
import { YouTubeDataTask } from "@/utils/types/app/sns-crawler";

const Range = (props: {
	range: {
		start: dayjs.Dayjs;
		end: dayjs.Dayjs;
	};
	setRange: Dispatch<
		SetStateAction<{
			start: dayjs.Dayjs;
			end: dayjs.Dayjs;
		}>
	>;
	getYouTubeTaskByIdQuery: UseQueryResult<YouTubeDataTask, Error>;
}) => {
	const { range, setRange, getYouTubeTaskByIdQuery } = props;

	useEffect(() => {
		if (getYouTubeTaskByIdQuery.data) {
			if (
				getYouTubeTaskByIdQuery.data.timeRangeStart &&
				getYouTubeTaskByIdQuery.data.timeRangeEnd
			) {
				setRange({
					start: dayjs(getYouTubeTaskByIdQuery.data.timeRangeStart),
					end: dayjs(getYouTubeTaskByIdQuery.data.timeRangeEnd),
				});
			}
		}
	}, [getYouTubeTaskByIdQuery.data]);

	if (getYouTubeTaskByIdQuery.data) {
		if (
			getYouTubeTaskByIdQuery.data.timeRangeStart &&
			getYouTubeTaskByIdQuery.data.timeRangeEnd
		) {
			// setRange({
			// 	start: dayjs(getYouTubeTaskByIdQuery.data.timeRangeStart),
			// 	end: dayjs(getYouTubeTaskByIdQuery.data.timeRangeEnd),
			// });
			return (
				<div
					className="px-2 py-1
					text-white/70 text-sm
					bg-neutral-700
					rounded cursor-not-allowed"
				>
					{dayjs(getYouTubeTaskByIdQuery.data.timeRangeStart).format(
						"MMM DD, YYYY"
					)}{" "}
					-{" "}
					{dayjs(getYouTubeTaskByIdQuery.data.timeRangeEnd).format(
						"MMM DD, YYYY"
					)}
				</div>
			);
		} else {
			return <DateRangePicker range={range} setRange={setRange} />;
		}
	}
	return <DateRangePicker range={range} setRange={setRange} />;
};

export const ControlBar = (props: {
	taskId: number;
	status: TaskStatus;
	getYouTubeTaskByIdQuery: UseQueryResult<YouTubeDataTask, Error>;
	range: {
		start: dayjs.Dayjs;
		end: dayjs.Dayjs;
	};
	setRange: Dispatch<
		SetStateAction<{
			start: dayjs.Dayjs;
			end: dayjs.Dayjs;
		}>
	>;
	targetResultCount: number;
	setTargetResultCount: Dispatch<SetStateAction<number>>;
}) => {
	const {
		taskId,
		status,
		getYouTubeTaskByIdQuery,
		range,
		setRange,
		targetResultCount,
		setTargetResultCount,
	} = props;
	const jwt = useAuthStore((state) => state.jwt);
	const searchMutation = useMutation({
		mutationFn: () => {
			return startTaskById(
				{
					taskId: taskId,
					start: range.start.toISOString(),
					end: range.end.toISOString(),
					targetResultCount: targetResultCount,
				},
				jwt
			);
		},
		onSuccess: () => {},
		onError: () => {},
	});

	const abortMutation = useMutation({
		mutationFn: () => {
			return abortTask(jwt);
		},
		onSuccess: () => {},
		onError: () => {},
	});

	switch (status) {
		case TaskStatus.IDLE:
			return (
				<div
					className="relative flex items-center px-6 py-2 gap-3 flex-wrap
					border-t-[1px] border-white/10"
				>
					<Range
						range={range}
						setRange={setRange}
						getYouTubeTaskByIdQuery={getYouTubeTaskByIdQuery}
					/>
					<div className="text-white/50">
						Target Result Count (Per Keyword)
					</div>
					{getYouTubeTaskByIdQuery.data &&
					getYouTubeTaskByIdQuery.data.targetResultCount ? (
						<div
							className="px-2 py-1
							text-white/70 text-sm
							bg-neutral-700
							rounded cursor-not-allowed"
						>
							{getYouTubeTaskByIdQuery.data.targetResultCount}
						</div>
					) : (
						<Input
							type="number"
							min={1}
							sz={"sm"}
							placeholder="Target Result Count"
							value={targetResultCount}
							onChange={(e) => {
								setTargetResultCount(
									parseInt(e.target.value) || 0
								);
							}}
							isError={false}
						/>
					)}
					<Button
						size="sm"
						onClick={() => {
							searchMutation.mutate();
						}}
					>
						Search Keywords
					</Button>
				</div>
			);
		default:
			return (
				<div
					className="relative flex items-center px-6 py-2 gap-3 flex-wrap
					border-t-[1px] border-white/10"
				>
					<Button
						size="sm"
						onClick={() => {
							abortMutation.mutate();
						}}
					>
						Abort
					</Button>
				</div>
			);
	}
};
