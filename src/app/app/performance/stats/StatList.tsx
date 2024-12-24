import { useAuthStore } from "@/stores/auth";
import { getStats, PerformanceQK } from "@/utils/api/app/performance";
import { PerformanceStatResponse } from "@/utils/types/app/performance";
import { Member } from "@/utils/types/internal";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Link from "next/link";

export const StatList = (props: { member?: Member; year: dayjs.Dayjs }) => {
	const { member, year } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const statsQuery = useQuery<PerformanceStatResponse[], AxiosError>({
		queryKey: [PerformanceQK.GET_STATS],
		queryFn: async () => {
			const stats = await getStats(member?.id as string, jwt);
			return stats;
		},
		retry: false,
		enabled: !!member,
		refetchOnWindowFocus: false,
	});

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
