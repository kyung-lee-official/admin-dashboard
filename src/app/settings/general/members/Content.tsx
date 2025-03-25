"use client";

import { Avatar } from "@/components/avatar/Avatar";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { Exception } from "@/components/page-authorization/Exception";
import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getMembers, MembersQK } from "@/utils/api/members";
import { Member } from "@/utils/types/internal";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_MEMBER,
	});

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
								<th>Roles</th>
							</tr>
						</Thead>
						<Tbody>
							{membersQuery.data.map((m, i) => {
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
												{m.memberRoles.map((r, j) => {
													return (
														<div
															key={j}
															className="flex gap-x-1 px-1
															border-neutral-500 border-1
															rounded"
														>
															<div>{r.name}</div>
															<div className="text-neutral-500">
																{r.id}
															</div>
														</div>
													);
												})}
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
	} else {
		return <Exception />;
	}
};
