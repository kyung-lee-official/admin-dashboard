import { useAuthStore } from "@/stores/auth";
import { searchStats, PerformanceQK } from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { PerformanceStatResponse } from "@/utils/types/app/performance";
import { Member } from "@/utils/types/internal";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect } from "react";

export const StatList = (props: { member?: Member; year: dayjs.Dayjs }) => {
	const { member, year } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const statsQuery = useQuery<PerformanceStatResponse[], AxiosError>({
		queryKey: [PerformanceQK.SEARCH_STATS],
		queryFn: async () => {
			const searchStatDto = {
				ownerId: member!.id,
				year: year.toISOString(),
			};
			const stats = await searchStats(searchStatDto, jwt);
			return stats;
		},
		retry: false,
		enabled: !!member,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		queryClient.invalidateQueries({
			queryKey: [PerformanceQK.SEARCH_STATS],
		});
	}, [member, year]);

	return (
		<div
			className="flex flex-col
			text-white/50"
		>
			{member &&
				statsQuery.isSuccess &&
				statsQuery.data
					.sort((a, b) => {
						return dayjs(a.month).isBefore(dayjs(b.month)) ? 1 : -1;
					})
					.map((stat, i) => {
						return (
							<Link
								href={`stats/${stat.id}`}
								key={i}
								className="flex items-center h-11 px-6
								hover:bg-white/5
								border-t-[1px] border-white/10"
							>
								{dayjs(stat.month).format("MMMM YYYY")}
							</Link>
						);
					})}
		</div>
	);
};
