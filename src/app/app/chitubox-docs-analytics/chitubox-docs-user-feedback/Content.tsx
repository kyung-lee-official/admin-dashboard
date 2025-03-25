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
import { PageBlock, PageContainer } from "@/components/content/PageContainer";

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
		<PageContainer>
			<PageBlock
				title={
					<div className="flex items-center gap-2">
						<div>Select Date Rage</div>
						<div className="flex items-center gap-3">
							<DateRangePicker
								range={range}
								setRange={setRange}
							/>
							<Button
								size="sm"
								disabled={isEndBeforeStart}
								isLoading={feedbacksQuery.isFetching}
								onClick={onQuery}
							>
								Query
							</Button>
						</div>
					</div>
				}
			></PageBlock>
			<div className="flex justify-start w-full"></div>
		</PageContainer>
	);
};
