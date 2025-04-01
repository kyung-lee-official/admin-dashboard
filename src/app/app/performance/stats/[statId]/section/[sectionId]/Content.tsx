"use client";

import { Button } from "@/components/button/Button";
import { CircularProgress } from "@/components/progress/circular-progress/CircularProgress";
import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getSectionById, PerformanceQK } from "@/utils/api/app/performance";
import {
	ApprovalType,
	EventResponse,
	SectionResponse,
} from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
import { Exception } from "@/components/page-authorization/Exception";
import { Forbidden } from "@/components/page-authorization/Forbidden";

export const Content = (props: { statId: string; sectionId: string }) => {
	const { statId, sectionId } = props;

	const jwt = useAuthStore((state) => state.jwt);
	const router = useRouter();

	const sectionQuery = useQuery<SectionResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_SECTION_BY_ID],
		queryFn: async () => {
			const section = await getSectionById(parseInt(sectionId), jwt);
			return section;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (sectionQuery.isLoading) {
		return <Loading />;
	}

	if (sectionQuery.isError) {
		if (sectionQuery.error.code === "ERR_BAD_REQUEST") {
			return (
				<PageContainer>
					<Forbidden />
				</PageContainer>
			);
		} else {
			return (
				<PageContainer>
					<PageBlock
						title={
							<div
								className="flex justify-center w-full
								text-lg font-semibold"
							>
								Error: {sectionQuery.error.message}
							</div>
						}
					></PageBlock>
				</PageContainer>
			);
		}
	}

	if (!sectionQuery.data) {
		return <Exception />;
	}

	const { stat, memberRole, events } = sectionQuery.data;
	const { month, owner } = stat;

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
									<div>
										{sectionQuery.data.memberRole.name}
									</div>
									<div className="text-neutral-500">
										{sectionQuery.data.memberRole.id}
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>Section Title</td>
							<td>{sectionQuery.data.title}</td>
						</tr>
						<tr>
							<td>Section Weight</td>
							<td>{sectionQuery.data.weight}</td>
						</tr>
						<tr>
							<td>Section Description</td>
							<td>{sectionQuery.data.description}</td>
						</tr>
						<tr>
							<td>Section Score</td>
							<td>
								<div className="flex items-center gap-2">
									<CircularProgress
										size={24}
										progress={Math.min(
											sectionQuery.data.events.reduce(
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
									{sectionQuery.data.events.reduce(
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
								{sectionQuery.data.events.reduce(
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
							router.push(`${sectionQuery.data.id}/create-event`);
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
						{sectionQuery.data.events.map(
							(ev: EventResponse, i) => {
								return (
									<tr key={ev.id}>
										<td>{ev.description}</td>
										<td>{ev.approval}</td>
										<td>{ev.score}</td>
										<td>{ev.amount}</td>
										<td>{ev.score * ev.amount}</td>
										<td>
											<Link
												href={`${sectionQuery.data.id}/event/${ev.id}`}
												className="underline"
											>
												Details
											</Link>
										</td>
									</tr>
								);
							}
						)}
					</tbody>
				</table>
			</PageBlock>
		</PageContainer>
	);
};
