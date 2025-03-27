"use client";

import { Avatar } from "@/components/avatar/Avatar";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";
import {
	TitleMoreMenu,
	TitleMoreMenuItem,
} from "@/components/content/TitleMoreMenu";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { CopyIcon, DeleteIcon } from "@/components/icons/Icons";
import { Exception } from "@/components/page-authorization/Exception";
import { Forbidden } from "@/components/page-authorization/Forbidden";
import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import {
	deleteMemberById,
	getMembers,
	getPermissions,
	MembersQK,
} from "@/utils/api/members";
import { queryClient } from "@/utils/react-query/react-query";
import { Member } from "@/utils/types/internal";
import {
	QueryObserverPlaceholderResult,
	QueryObserverSuccessResult,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { createPortal } from "react-dom";

const memberMenuItems = (
	m: Member,
	setMemberToDelete: Dispatch<SetStateAction<Member | null>>,
	setShowDeleteConfirmation: Dispatch<SetStateAction<boolean>>,
	memberPermQuery:
		| QueryObserverSuccessResult<any, Error>
		| QueryObserverPlaceholderResult<any, Error>
): TitleMoreMenuItem[] => {
	return [
		{
			content: "Copy Member ID",
			hideMenuOnClick: true,
			onClick: () => {
				navigator.clipboard.writeText(m.id);
			},
			icon: <CopyIcon size={15} />,
		},
		...(memberPermQuery.data.actions["*"] === "EFFECT_ALLOW"
			? [
					{
						content: "Delete Member",
						type: "danger" as const,
						hideMenuOnClick: true,
						onClick: () => {
							setMemberToDelete(m);
							setShowDeleteConfirmation(true);
						},
						icon: <DeleteIcon size={15} />,
					},
			  ]
			: []),
	];
};

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_MEMBER,
	});

	const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const jwt = useAuthStore((state) => state.jwt);
	const memberPermQuery = useQuery({
		queryKey: [MembersQK.GET_MY_MEMBER_PERMISSIONS],
		queryFn: async () => {
			const data = await getPermissions(jwt);
			return data;
		},
	});

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

	if (memberPermQuery.isPending) {
		return <Loading />;
	}

	if (memberPermQuery.isSuccess && memberPermQuery.data) {
		switch (memberPermQuery.data.actions["read"]) {
			case "EFFECT_ALLOW":
				return (
					<PageContainer>
						<PageBlock
							title="Members"
							moreMenu={
								memberPermQuery.data.actions["*"] ===
									"EFFECT_ALLOW" && (
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
											<EditPanel
												edit={edit}
												setEdit={setEdit}
											/>,
											document.body
										)}
									</>
								)
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
									{membersQuery.data &&
										membersQuery.data
											/* sort by name */
											.sort((a, b) =>
												a.name.localeCompare(b.name)
											)
											.map((m, i) => {
												return (
													<tr key={i}>
														<td>
															<div className="flex items-center gap-x-6">
																<div className="w-8 h-8">
																	<Avatar
																		member={
																			m
																		}
																	/>
																</div>
																<div>
																	<div>
																		{m.name}
																	</div>
																	<div className="text-neutral-500">
																		{
																			m.email
																		}
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
																				key={
																					j
																				}
																				className="flex gap-x-1 px-1
																				border-neutral-500 border-1
																				rounded"
																			>
																				<div>
																					{
																						r.name
																					}
																				</div>
																				<div className="text-neutral-500">
																					{
																						r.id
																					}
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
																	items={memberMenuItems(
																		m,
																		setMemberToDelete,
																		setShowDeleteConfirmation,
																		memberPermQuery
																	)}
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
									deleteMutation.mutate(
										memberToDelete?.id as string
									);
									setShowDeleteConfirmation(false);
								}}
							/>
						</PageBlock>
					</PageContainer>
				);
			default:
				return <Forbidden />;
		}
	} else {
		return <Exception />;
	}
};
