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
	SectionResponse,
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
import { DeleteIcon, EditIcon, InfoIcon } from "@/components/icons/Icons";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { createPortal } from "react-dom";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";
import Tooltip from "@/components/tooltip/Tooltip";
import { Forbidden } from "@/components/page-authorization/Forbidden";

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

	if (statsQuery.isError) {
		if (statsQuery.error.code === "ERR_BAD_REQUEST") {
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
								{statsQuery.error.message}
							</div>
						}
					></PageBlock>
				</PageContainer>
			);
		}
	}

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

	const statStatus = (sections: SectionResponse[]) => {
		if (
			statSections.some((s) => {
				return s.events.some(
					(e) => e.approval === ApprovalType.PENDING
				);
			})
		) {
			return (
				<div className="flex items-center gap-2">
					<div>HAS PENDING</div>
					<Tooltip text="Some sections have pending events">
						<InfoIcon size={15} />
					</Tooltip>
				</div>
			);
		} else {
			if (
				statSections.some((s) => {
					return s.events.some(
						(e) => e.approval === ApprovalType.REJECTED
					);
				})
			) {
				return (
					<div className="flex items-center gap-2">
						<div>HAS REJECTED</div>
						<Tooltip text="All events are reviewed but some are rejected">
							<InfoIcon size={15} />
						</Tooltip>
					</div>
				);
			} else {
				return "ALL APPROVED";
			}
		}
	};

	const sectionStatus = (s: SectionResponse) => {
		if (s.events.some((e) => e.approval === ApprovalType.PENDING)) {
			return (
				<div className="flex items-center gap-2">
					<div>HAS PENDING</div>
					<Tooltip text="Some sections have pending events">
						<InfoIcon size={15} />
					</Tooltip>
				</div>
			);
		} else {
			if (s.events.some((e) => e.approval === ApprovalType.REJECTED)) {
				return (
					<div className="flex items-center gap-2">
						<div>HAS REJECTED</div>
						<Tooltip text="All events are reviewed but some are rejected">
							<InfoIcon size={15} />
						</Tooltip>
					</div>
				);
			} else {
				return "ALL APPROVED";
			}
		}
	};

	return (
		<PageContainer>
			<PageBlock
				title="Stat"
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								{
									content: "Add a section",
									hideMenuOnClick: true,
									icon: <EditIcon size={15} />,
									onClick: () => {
										setEdit({
											show: true,
											id: EditId.ADD_SECTION,
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
							<td>{statStatus(statSections)}</td>
						</tr>
					</Tbody>
				</Table>
			</PageBlock>
			<PageBlock title="Sections">
				<Table>
					<Thead>
						<tr>
							<th className="w-2/12">Section Role</th>
							<th className="w-2/12">Title</th>
							<th className="w-2/12">Approval</th>
							<th className="w-1/12">Weight</th>
							<th className="w-1/12">Score</th>
							<th className="w-2/12">Submitted Score</th>
							<th className="w-4/12">Description</th>
						</tr>
					</Thead>
					<Tbody>
						{[...statSections]
							.sort((a, b) => {
								return a.createdAt.localeCompare(b.createdAt);
							})
							.map((s, i) => {
								return (
									<tr
										key={s.id}
										className="cursor-pointer"
										onClick={() => {
											router.push(
												`${statId}/section/${s.id}`
											);
										}}
									>
										<td>
											<div>{s.memberRole.name}</div>
											<div className="text-xs text-neutral-500">
												{s.memberRole.id}
											</div>
										</td>
										<td>{s.title}</td>
										<td>{sectionStatus(s)}</td>
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
