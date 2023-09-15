"use client";

import { Button, DatePicker, DateRangePicker, Layout } from "@/components";
import { getChituboxManualFeedbacks, getIsSeeded } from "@/utilities/api/api";
import { MenuKey, useSidebarStore } from "@/stores/sidebar";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { Geo } from "@/components/geo/Geo";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePathname } from "next/navigation";

const Index = () => {
	const pathname = usePathname();
	const setSelectedMenu = useSidebarStore((state) => state.setSelectedMenu);
	const setSelectedSubMenu = useSidebarStore(
		(state) => state.setSelectedSubMenu
	);
	const { accessToken } = useAuthStore();
	const [isEndBeforeStart, setIsEndBeforeStart] = useState<boolean>(false);
	const [startDate, setStartDate] = useState<dayjs.Dayjs>(
		dayjs().startOf("month")
	);
	const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs().endOf("month"));

	const feedbacksQuery = useQuery<any, AxiosError>({
		queryKey: ["feedbacksQuery", accessToken],
		queryFn: async () => {
			const feedbacks = await getChituboxManualFeedbacks(
				startDate,
				endDate,
				accessToken
			);
			return feedbacks;
		},
		enabled: true,
		retry: false,
		refetchOnWindowFocus: false,
	});

	const onDateRangeChange = (
		selectedStartDate: dayjs.Dayjs,
		selectedEndDate: dayjs.Dayjs
	) => {
		if (selectedEndDate.isBefore(selectedStartDate)) {
			setIsEndBeforeStart(true);
		} else {
			setIsEndBeforeStart(false);
			setStartDate(selectedStartDate);
			setEndDate(selectedEndDate);
		}
	};

	const onQuery = () => {
		feedbacksQuery.refetch();
	};

	useEffect(() => {
		setSelectedMenu(MenuKey.CHITUBOX_DOCS_ANALYTICS);
		setSelectedSubMenu(MenuKey.CHITUBOX_DOCS_ANALYTICS, pathname);
	}, [setSelectedMenu, setSelectedSubMenu]);

	return (
		<div
			className="flex flex-col justify-start items-center gap-8 min-h-screen
			p-10
			font-bold text-gray-600 dark:text-gray-500"
		>
			<div
				className="flex justify-start items-center w-full
				text-xl"
			>
				Select Date Rage
			</div>
			{/* <div className="flex justify-start items-end gap-3 w-full">
				<DatePicker />
			</div> */}
			<div className="flex justify-start items-end gap-3 w-full">
				<DateRangePicker onChange={onDateRangeChange} />
				<Button
					disabled={isEndBeforeStart}
					isLoading={feedbacksQuery.isFetching}
					onClick={onQuery}
				>
					Query
				</Button>
			</div>
			<div className="flex justify-start w-full">
				<Geo feedbacks={feedbacksQuery.data} />
			</div>
		</div>
	);
};

export default Index;
