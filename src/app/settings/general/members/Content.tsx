"use client";

import { Avatar } from "@/components/avatar/Avatar";
import { ConfirmDialogWithButton } from "@/components/confirm-dialog/ConfirmDialogWithButton";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";
import {
	TitleMoreMenu,
	TitleMoreMenuButton,
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
	UseMutationResult,
	useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";

const memberMenuItems = (
	m: Member,
	deleteMutation: UseMutationResult<any, Error, string, unknown>,
	memberPermQuery:
		| QueryObserverSuccessResult<any, Error>
		| QueryObserverPlaceholderResult<any, Error>
) => {
	return [
		<TitleMoreMenuButton
			key={"copy-member-id-" + m.id}
			onClick={() => {
				navigator.clipboard.writeText(m.id);
			}}
		>
			<CopyIcon size={15} /> Copy Member ID
		</TitleMoreMenuButton>,
		...(memberPermQuery.data.actions["*"] === "EFFECT_ALLOW"
			? [
					<ConfirmDialogWithButton
						key={"delete-member-" + m.id}
						question={
							"Are you sure you want to delete this member?"
						}
						data={m.id}
						onOk={(id: string | undefined) => {
							deleteMutation.mutate(id as string);
						}}
					>
						<div
							className={`flex items-center w-full px-2 py-1.5 gap-2
							text-red-500
							hover:bg-white/5
							rounded cursor-pointer whitespace-nowrap`}
						>
							<DeleteIcon size={15} />
							Delete Member
						</div>
					</ConfirmDialogWithButton>,
			  ]
			: []),
	];
};

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_MEMBER,
	});

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
			return deleteMemberById(data as string, jwt);
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
												<TitleMoreMenuButton
													key={EditId.ADD_MEMBER}
													onClick={() => {
														setEdit({
															show: true,
															id: EditId.ADD_MEMBER,
														});
													}}
												>
													Add Member
												</TitleMoreMenuButton>,
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
										[...membersQuery.data]
											/* sort by name */
											.sort((a, b) =>
												a.name.localeCompare(b.name)
											)
											.map((m) => {
												return (
													<tr key={m.id}>
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
																					r.id
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
																		deleteMutation,
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
