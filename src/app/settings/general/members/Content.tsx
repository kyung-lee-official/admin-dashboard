"use client";

import { Avatar } from "@/components/avatar/Avatar";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { CopyIcon, DeleteIcon } from "@/components/icons/Icons";
import { Exception } from "@/components/page-authorization/Exception";
import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { deleteMemberById, getMembers, MembersQK } from "@/utils/api/members";
import { queryClient } from "@/utils/react-query/react-query";
import { Member } from "@/utils/types/internal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_MEMBER,
	});

	const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const jwt = useAuthStore((state) => state.jwt);
	const membersQuery = useQuery<Member[], AxiosError>({
		queryKey: [MembersQK.GET_MEMBERS],
		queryFn: async () => {
			const members = await getMembers(jwt);
			return members;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const deleteMutation = useMutation({
		mutationFn: (data: string) => {
			return deleteMemberById(data, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [MembersQK.GET_MEMBERS],
			});
		},
		onError: () => {},
	});

	if (membersQuery.isPending) {
		return <Loading />;
	}

	if (membersQuery.isSuccess && membersQuery.data) {
		return (
			<PageContainer>
				<PageBlock
					title="Members"
					moreMenu={
						<>
							<TitleMoreMenu
								items={[
									{
										content: "Add Member",
										hideMenuOnClick: true,
										onClick: () => {
											setEdit({
												show: true,
												id: EditId.ADD_MEMBER,
											});
										},
									},
								]}
							/>
							{createPortal(
								<EditPanel edit={edit} setEdit={setEdit} />,
								document.body
							)}
						</>
					}
				>
					<Table>
						<Thead>
							<tr>
								<th>User</th>
								<th colSpan={2}>Roles</th>
							</tr>
						</Thead>
						<Tbody>
							{membersQuery.data
								/* sort by name */
								.sort((a, b) => a.name.localeCompare(b.name))
								.map((m, i) => {
									return (
										<tr key={i}>
											<td>
												<div className="flex items-center gap-x-6">
													<div className="w-8 h-8">
														<Avatar member={m} />
													</div>
													<div>
														<div>{m.name}</div>
														<div className="text-neutral-500">
															{m.email}
														</div>
													</div>
												</div>
											</td>
											<td>
												<div className="flex flex-wrap gap-2">
													{m.memberRoles.map(
														(r, j) => {
															return (
																<div
																	key={j}
																	className="flex gap-x-1 px-1
															border-neutral-500 border-1
															rounded"
																>
																	<div>
																		{r.name}
																	</div>
																	<div className="text-neutral-500">
																		{r.id}
																	</div>
																</div>
															);
														}
													)}
												</div>
											</td>
											<td>
												<div className="flex justify-end">
													<TitleMoreMenu
														items={[
															{
																content:
																	"Copy Member ID",
																hideMenuOnClick:
																	true,
																onClick: () => {
																	navigator.clipboard.writeText(
																		m.id
																	);
																},
																icon: (
																	<CopyIcon
																		size={
																			15
																		}
																	/>
																),
															},
															{
																content:
																	"Delete Member",
																type: "danger",
																hideMenuOnClick:
																	true,
																onClick: () => {
																	setMemberToDelete(
																		m
																	);
																	setShowDeleteConfirmation(
																		true
																	);
																},
																icon: (
																	<DeleteIcon
																		size={
																			15
																		}
																	/>
																),
															},
														]}
													/>
												</div>
											</td>
										</tr>
									);
								})}
						</Tbody>
					</Table>
					<ConfirmDialog
						show={showDeleteConfirmation}
						setShow={setShowDeleteConfirmation}
						question={
							"Are you sure you want to delete this member?"
						}
						onOk={() => {
							deleteMutation.mutate(memberToDelete?.id as string);
							setShowDeleteConfirmation(false);
						}}
					/>
				</PageBlock>
			</PageContainer>
		);
	} else {
		return <Exception />;
	}
};
