"use client";

import { Button } from "@/components/button/Button";
import { CircularProgress } from "@/components/progress/circular-progress/CircularProgress";
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
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";

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
		<PageContainer>
			<PageBlock title="Stat">
				<Table>
					<Tbody>
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
					</Tbody>
				</Table>
			</PageBlock>
			<PageBlock title="Section">
				<Table>
					<Tbody>
						<tr>
							<td>Section Role</td>
							<td>
								<div
									className="flex w-fit px-1 gap-2
									border border-neutral-500 rounded"
								>
									<div>{section.memberRole.name}</div>
									<div className="text-neutral-500">
										{section.memberRole.id}
									</div>
								</div>
							</td>
						</tr>
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
					</Tbody>
				</Table>
			</PageBlock>
			<PageBlock
				title="Events"
				moreMenu={
					<Button
						size="sm"
						onClick={() => {
							router.push(`${section.id}/create-event`);
						}}
						className="truncate"
					>
						Create Event
					</Button>
				}
			>
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
								<tr key={ev.id}>
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
			</PageBlock>
		</PageContainer>
	);
};
