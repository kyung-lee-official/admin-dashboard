import dayjs from "dayjs";
import { TaskStatus } from "./Content";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/button/Button";
import { DateRangePicker } from "@/components/date/date-range-picker/DateRangePicker";
import { Input } from "@/components/input/Input";
import { YouTubeDataTaskKeyword } from "@/utils/types/app/sns-crawler";
import { useMutation } from "@tanstack/react-query";
import {
	abortTask,
	startTaskById,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";
import { useAuthStore } from "@/stores/auth";

export const ControlBar = (props: {
	taskId: number;
	status: TaskStatus;
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
					<Button
						size="sm"
						onClick={() => {
							searchMutation.mutate();
						}}
					>
						Search Keywords
					</Button>
					<DateRangePicker range={range} setRange={setRange} />
					<div>Target Result Count (Per Keyword)</div>
					<Input
						type="number"
						min={1}
						sz={"sm"}
						placeholder="Target Result Count"
						value={targetResultCount}
						onChange={(e) => {
							setTargetResultCount(parseInt(e.target.value) || 0);
						}}
						isError={false}
					/>
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
