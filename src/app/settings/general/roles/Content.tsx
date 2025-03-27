"use client";

import { useState } from "react";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getPermissions, getRolesByIds, RolesQK } from "@/utils/api/roles";
import { useAuthStore } from "@/stores/auth";
import { ItemMoreMenu } from "./moreMenu/ItemMoreMenu";
import { Loading } from "@/components/page-authorization/Loading";
import { Forbidden } from "@/components/page-authorization/Forbidden";
import { Exception } from "@/components/page-authorization/Exception";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { EditIcon } from "@/components/icons/Icons";
import { sortByProp } from "@/utils/data/data";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";

export const Content = () => {
	const jwt = useAuthStore((state) => state.jwt);
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_ROLE,
	});

	const rolePermQuery = useQuery({
		queryKey: [RolesQK.GET_MY_ROLE_PERMISSIONS],
		queryFn: async () => {
			const data = await getPermissions(jwt);
			return data;
		},
	});

	const rolesQuery = useQuery<any, AxiosError>({
		queryKey: [RolesQK.GET_ROLES_BY_IDS],
		queryFn: async () => {
			const roles = await getRolesByIds(jwt, []);
			return roles;
		},
		enabled: rolePermQuery.isSuccess,
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (rolePermQuery.isPending) {
		return <Loading />;
	}

	if (rolePermQuery.isSuccess) {
		switch (rolePermQuery.data.actions["read"]) {
			case "EFFECT_DENY":
				return <Forbidden />;
			case "EFFECT_ALLOW":
				return (
					<PageContainer>
						<PageBlock
							title="Roles"
							moreMenu={
								rolePermQuery.data.actions["*"] ===
									"EFFECT_ALLOW" && (
									<>
										<TitleMoreMenu
											items={[
												{
													content: "Add a role",
													hideMenuOnClick: true,
													icon: (
														<EditIcon size={15} />
													),
													onClick: () => {
														setEdit({
															show: true,
															id: EditId.ADD_ROLE,
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
							{/* <div
								className="flex justify-end items-center px-6 py-4
								text-sm
								rounded-md border-t-[1px] border-white/10"
							>
								Search
							</div> */}
							<Table>
								<Tbody>
									<tr>
										<td className="w-1/2">Name</td>
										<td className="w-1/2">Role ID</td>
										<td>
											<div className="w-7 h-7">
												{/* placeholder */}
											</div>
										</td>
									</tr>
									{rolesQuery.isSuccess &&
										sortByProp(rolesQuery.data, "id").map(
											(role: any) => {
												return (
													<tr key={role.id}>
														<td className="w-1/2">
															{role.name}
														</td>
														<td className="w-1/2">
															{role.id}
														</td>
														<td>
															{rolePermQuery.data
																.actions[
																"*"
															] ===
																"EFFECT_ALLOW" && (
																<ItemMoreMenu
																	edit={{
																		...edit,
																		auxData:
																			{
																				roleId: role.id,
																			},
																	}}
																	setEdit={
																		setEdit
																	}
																/>
															)}
														</td>
													</tr>
												);
											}
										)}
								</Tbody>
							</Table>
						</PageBlock>
					</PageContainer>
				);
			default:
				return <Exception />;
		}
	} else {
		return <Exception />;
	}
};
