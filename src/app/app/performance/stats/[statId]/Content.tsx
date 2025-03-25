"use client";

import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import {
	deleteStatById,
	getStatById,
	PerformanceQK,
} from "@/utils/api/app/performance";
import {
	ApprovalType,
	PerformanceStatResponse,
} from "@/utils/types/app/performance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@/components/progress/circular-progress/CircularProgress";
import { useState } from "react";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { queryClient } from "@/utils/react-query/react-query";
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { createPortal } from "react-dom";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";

export const Content = (props: { statId: number }) => {
	const { statId } = props;
	const jwt = useAuthStore((state) => state.jwt);
	const router = useRouter();

	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.EDIT_STAT,
	});
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const mutation = useMutation({
		mutationFn: () => {
			return deleteStatById(statId, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_STATS],
			});
			router.push("/app/performance/stats");
		},
		onError: () => {},
	});
	function onDelete() {
		mutation.mutate();
	}

	const statsQuery = useQuery<PerformanceStatResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_STAT_BY_ID],
		queryFn: async () => {
			const stats = await getStatById(statId, jwt);
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
	const statScore = statSections.reduce(
		(acc, s) =>
			acc +
			(Math.min(
				s.events.reduce(
					(acc, e) =>
						acc +
						(e.approval === ApprovalType.APPROVED
							? e.score * e.amount
							: 0),
					0
				),
				100
			) *
				s.weight) /
				100,
		0
	);
	return (
		<PageContainer>
			<PageBlock
				title="Stat"
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								{
									content: "Edit Stat",
									hideMenuOnClick: true,
									icon: <EditIcon size={15} />,
									onClick: () => {
										setEdit({
											show: true,
											id: EditId.EDIT_STAT,
											auxData: {
												statId: statId,
											},
										});
									},
								},
								{
									content: "Delete Stat",
									type: "danger",
									hideMenuOnClick: true,
									icon: <DeleteIcon size={15} />,
									onClick: () => {
										setShowDeleteConfirmation(true);
									},
								},
							]}
						/>
						<ConfirmDialog
							show={showDeleteConfirmation}
							setShow={setShowDeleteConfirmation}
							question={
								"Are you sure you want to delete this stat?"
							}
							onOk={onDelete}
						/>
						{createPortal(
							<EditPanel edit={edit} setEdit={setEdit} />,
							document.body
						)}
					</>
				}
			>
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
						<tr>
							<td>Score</td>
							<td>
								<div className="flex items-center gap-2">
									<CircularProgress
										size={24}
										progress={statScore}
									/>
									{statScore.toFixed(3)}
								</div>
							</td>
						</tr>
						<tr>
							<td>Approval</td>
							<td>
								{statSections.some((s) => {
									return s.events.some(
										(e) =>
											e.approval === ApprovalType.PENDING
									);
								})
									? ApprovalType.PENDING
									: "ALL REVIEWED"}
							</td>
						</tr>
					</Tbody>
				</Table>
			</PageBlock>
			<PageBlock title="Sections">
				<Table>
					<Thead>
						<tr>
							<th className="w-2/12">Title</th>
							<th className="w-2/12">Approval</th>
							<th className="w-1/12">Weight</th>
							<th className="w-1/12">Score</th>
							<th className="w-2/12">Submitted Score</th>
							<th className="w-4/12">Description</th>
						</tr>
					</Thead>
					<Tbody>
						{statSections
							.sort((a, b) => {
								return a.createdAt.localeCompare(b.createdAt);
							})
							.map((s, i) => {
								return (
									<tr
										key={i}
										className="cursor-pointer"
										onClick={() => {
											router.push(
												`${statId}/section/${s.id}`
											);
										}}
									>
										<td>{s.title}</td>
										<td>
											{s.events.some((e) => {
												return (
													e.approval ===
													ApprovalType.PENDING
												);
											})
												? ApprovalType.PENDING
												: "ALL REVIEWED"}
										</td>
										<td>{s.weight}</td>
										<td>
											<div className="flex items-center gap-2">
												<CircularProgress
													size={24}
													progress={s.events.reduce(
														(acc, e) =>
															acc +
															(e.approval ===
															ApprovalType.APPROVED
																? e.score *
																  e.amount
																: 0),
														0
													)}
												/>
												{s.events.reduce(
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
										<td>
											{s.events.reduce(
												(acc, e) =>
													acc + e.score * e.amount,
												0
											)}
										</td>
										<td>{s.description}</td>
									</tr>
								);
							})}
					</Tbody>
				</Table>
			</PageBlock>
		</PageContainer>
	);
};
