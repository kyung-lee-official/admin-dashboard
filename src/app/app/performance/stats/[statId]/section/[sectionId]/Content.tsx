"use client";

import { Button } from "@/components/button/Button";
import { CircularProgress } from "@/components/circular-progress/CircularProgress";
import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getStatById, PerformanceQK } from "@/utils/api/app/performance";
import {
	ApprovalType,
	EventResponse,
	PerformanceStatResponse,
} from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Content = (props: { statId: string; sectionId: string }) => {
	const { statId, sectionId } = props;

	const jwt = useAuthStore((state) => state.jwt);
	const router = useRouter();

	const statsQuery = useQuery<PerformanceStatResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_STAT_BY_ID],
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
	const { month, owner, statSections } = statsQuery.data!;

	const section = statSections.find((s) => s.id === parseInt(sectionId));
	if (!section) {
		return null;
	}

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="flex justify-between items-center w-full px-6 py-4">
					<div className="text-lg font-semibold">Stat</div>
					{/* <TitleMoreMenu /> */}
				</div>
				<table
					className="w-full
					text-sm text-white/50"
				>
					<tbody
						className="[&_>_tr_>_td]:px-6 [&_>_tr_>_td]:py-3
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
						<tr>
							<td>Month</td>
							<td>{dayjs(month).format("MMMM YYYY")}</td>
						</tr>
						<tr>
							<td>Owner</td>
							<td>
								{owner.name} ({owner.email})
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div
				className="text-white/50
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="flex justify-between items-center w-full px-6 py-4">
					<div className="text-lg font-semibold">Section</div>
					{/* <TitleMoreMenu /> */}
				</div>
				<table
					className="w-full
					text-sm text-white/50"
				>
					<tbody
						className="[&_>_tr_>_td]:px-6 [&_>_tr_>_td]:py-3
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
						<tr>
							<td>Section Title</td>
							<td>{section.title}</td>
						</tr>
						<tr>
							<td>Section Weight</td>
							<td>{section.weight}</td>
						</tr>
						<tr>
							<td>Section Description</td>
							<td>{section.description}</td>
						</tr>
						<tr>
							<td>Section Score</td>
							<td>
								<div className="flex items-center gap-2">
									<CircularProgress
										size={24}
										progress={Math.min(
											section.events.reduce(
												(acc, e) =>
													acc +
													(e.approval ===
													ApprovalType.APPROVED
														? e.score * e.amount
														: 0),
												0
											),
											100
										)}
									/>
									{section.events.reduce(
										(acc, e) =>
											acc +
											(e.approval ===
											ApprovalType.APPROVED
												? e.score * e.amount
												: 0),
										0
									)}
								</div>
							</td>
						</tr>
						<tr>
							<td>Submitted Score</td>
							<td>
								{section.events.reduce(
									(acc, e) => acc + e.score * e.amount,
									0
								)}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div
				className="text-white/50
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="">Events</div>
					<Button
						size="sm"
						onClick={() => {
							router.push(`${section.id}/create-event`);
						}}
					>
						Create Event
					</Button>
				</div>
				<table className="text-sm text-white/50">
					<tbody
						className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
						<tr>
							<td className="w-2/6">Description</td>
							<td className="w-1/6">Approval</td>
							<td className="w-1/6">Score</td>
							<td className="w-1/6">Amount</td>
							<td className="w-1/6">Total Score</td>
							<td>
								<div className="w-7 h-7">
									{/* placeholder */}
								</div>
							</td>
						</tr>
						{section.events.map((ev: EventResponse, i) => {
							return (
								<tr key={i}>
									<td>{ev.description}</td>
									<td>{ev.approval}</td>
									<td>{ev.score}</td>
									<td>{ev.amount}</td>
									<td>{ev.score * ev.amount}</td>
									<td>
										<Link
											href={`${section.id}/event/${ev.id}`}
											className="underline"
										>
											Details
										</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
