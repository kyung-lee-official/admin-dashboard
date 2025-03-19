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
		switch (rolePermQuery.data.actions["*"]) {
			case "EFFECT_DENY":
				return <Forbidden />;
			case "EFFECT_ALLOW":
				return (
					<div className="w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 gap-y-3">
						<div
							className="text-white/90
							bg-white/5
							rounded-md border-[1px] border-white/10 border-t-white/15"
						>
							<div className="relative flex justify-between items-center px-6 py-4">
								<div className="text-lg font-semibold">
									Roles
								</div>
								<TitleMoreMenu
									items={[
										{
											content: "Add a role",
											hideMenuOnClick: true,
											icon: <EditIcon size={15} />,
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
									<EditPanel edit={edit} setEdit={setEdit} />,
									document.body
								)}
							</div>
							{/* <div
								className="flex justify-end items-center px-6 py-4
								text-sm
								rounded-md border-t-[1px] border-white/10"
							>
								Search
							</div> */}
							<table className="text-sm text-white/50 font-semibold">
								<tbody
									className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
									[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
								>
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
															<ItemMoreMenu
																edit={{
																	...edit,
																	auxData: {
																		roleId: role.id,
																	},
																}}
																setEdit={
																	setEdit
																}
															/>
														</td>
													</tr>
												);
											}
										)}
								</tbody>
							</table>
						</div>
						{createPortal(
							<EditPanel edit={edit} setEdit={setEdit} />,
							document.body
						)}
					</div>
				);
			default:
				return <Exception />;
		}
	} else {
		return <Exception />;
	}
};
