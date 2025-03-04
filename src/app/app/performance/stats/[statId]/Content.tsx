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
import { CircularProgress } from "@/components/circular-progress/CircularProgress";
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
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="flex flex-col gap-3
				text-white/90"
			>
				<div
					className="relative flex flex-col
					bg-white/5
					border-[1px] border-white/10 border-t-white/15
					rounded-md"
				>
					<div className="flex justify-between items-center w-full px-6 py-4">
						<div className="text-lg font-semibold">Stat</div>
						<TitleMoreMenu
							items={[
								{
									text: "Edit Stat",
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
									text: "Delete Stat",
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
												e.approval ===
												ApprovalType.PENDING
										);
									})
										? ApprovalType.PENDING
										: "ALL REVIEWED"}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div
					className="flex flex-col
					text-white/50
					bg-white/5
					border-[1px] border-white/10 border-t-white/15
					rounded-md"
				>
					<div
						className="px-6 py-4
						text-lg font-semibold"
					>
						Sections
					</div>
					<table
						className="w-full
						text-sm"
					>
						<thead
							className="[&_>_tr_>_th]:py-3 [&_>_tr_>_th]:px-6
							[&_>_tr_>_th]:text-left font-semibold
							[&_>_tr_>_th]:border-t-[1px] [&_>_tr_>_th]:border-white/10"
						>
							<tr>
								<th className="w-2/12">Title</th>
								<th className="w-2/12">Approval</th>
								<th className="w-1/12">Weight</th>
								<th className="w-1/12">Score</th>
								<th className="w-2/12">Submitted Score</th>
								<th className="w-4/12">Description</th>
							</tr>
						</thead>
						<tbody
							className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
							[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10
							[&_>_tr]:cursor-pointer"
						>
							{statSections.map((s, i) => {
								return (
									<tr
										key={i}
										className="hover:bg-white/5"
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
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
