"use client";

import dayjs from "dayjs";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import {
	ChituboxDocsAnalysisQK,
	getChituboxManualFeedbacks,
} from "@/utils/api/chitubox-manual-feedbacks";
import { Button } from "@/components/button/Button";
import { DateRangePicker } from "@/components/date/date-range-picker/DateRangePicker";

export const Content = () => {
	const pathname = usePathname();

	const jwt = useAuthStore((state) => state.jwt);
	const [isEndBeforeStart, setIsEndBeforeStart] = useState<boolean>(false);

	const [range, setRange] = useState({
		start: dayjs().startOf("month"),
		end: dayjs().endOf("month"),
	});

	const feedbacksQuery = useQuery<any, AxiosError>({
		queryKey: [ChituboxDocsAnalysisQK.GET_DOCS_FEEDBACKS],
		queryFn: async () => {
			const feedbacks = await getChituboxManualFeedbacks(
				range.start,
				range.end,
				jwt
			);
			return feedbacks;
		},
		enabled: true,
		retry: false,
		refetchOnWindowFocus: false,
	});

	const onQuery = () => {
		feedbacksQuery.refetch();
	};

	return (
		<div className="w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 gap-y-3">
			<div
				className="flex justify-start items-center w-full
				text-xl"
			>
				Select Date Rage
			</div>

			<div className="flex justify-start items-end gap-3 w-full">
				<DateRangePicker range={range} setRange={setRange} />
				<Button
					size="sm"
					disabled={isEndBeforeStart}
					isLoading={feedbacksQuery.isFetching}
					onClick={onQuery}
				>
					Query
				</Button>
			</div>
			<div className="flex justify-start w-full">
				{/* <Geo feedbacks={feedbacksQuery.data} /> */}
			</div>
		</div>
	);
};
