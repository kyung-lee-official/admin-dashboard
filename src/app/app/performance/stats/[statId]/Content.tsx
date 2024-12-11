"use client";

import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getStatById } from "@/utils/api/app/performance";
import { PerformanceStatResponse } from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const Content = (props: { statId: string }) => {
	const { statId } = props;

	const searchParams = useSearchParams();

	const jwt = useAuthStore((state) => state.jwt);

	const statsQuery = useQuery<PerformanceStatResponse, AxiosError>({
		queryKey: ["get-performance-stat-by-id", parseInt(statId), jwt],
		queryFn: async () => {
			const stats = await getStatById(parseInt(statId), jwt);
			return stats;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (statsQuery.isLoading) return <Loading />;

	if (statsQuery.isError) return <div>Error: {statsQuery.error.message}</div>;

	if (!statsQuery.data) {
		return null;
	}
	const { month, statSections } = statsQuery.data!;

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="flex flex-col">
						<div className="text-lg font-semibold">Stat</div>
						<div className="text-sm text-white/50">
							{dayjs(month).format("MMMM YYYY")}
						</div>
					</div>
					{/* <TitleMoreMenu /> */}
				</div>
				{statSections.map((s, i) => {
					return (
						<Link
							key={i}
							href={`${statId}/section/${s.id}`}
							className="flex items-center px-6 py-4 gap-6
							text-sm text-white/50
							rounded-md border-t-[1px] border-white/10"
						>
							<div>{s.title}</div>
							<div>{s.weight}</div>
							<div>{s.description}</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};
