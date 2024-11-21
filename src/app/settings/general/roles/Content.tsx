"use client";

import { EditIcon, MoreIcon } from "@/components/icons/Icons";
import { useRef, useState } from "react";
import { EditPanel, EditProps } from "../../EditPanel";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getRoles } from "@/utils/api/roles";
import { useAuthStore } from "@/stores/auth";
import { TitleMoreMenu } from "@/app/settings/general/roles/moreMenu/TitleMoreMenu";
import { ItemMoreMenu } from "./moreMenu/ItemMoreMenu";

export const Content = () => {
	const jwt = useAuthStore((state) => state.jwt);
	const [edit, setEdit] = useState<EditProps>({ show: false, id: "" });

	const rolesQuery = useQuery<any, AxiosError>({
		queryKey: ["get-roles", jwt],
		queryFn: async () => {
			const roles = await getRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	return (
		<div className="w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				rounded-md border-[1px] border-white/10 border-t-white/15"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Roles</div>
					<TitleMoreMenu />
				</div>
				<div
					className="flex justify-end items-center px-6 py-4
					text-sm
					rounded-md border-t-[1px] border-white/10"
				>
					Search
				</div>
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
							rolesQuery.data.map((role: any) => {
								return (
									<tr key={role.id}>
										<td className="w-1/2">{role.name}</td>
										<td className="w-1/2">{role.id}</td>
										<td>
											<ItemMoreMenu
												roleId={role.id}
												edit={edit}
												setEdit={setEdit}
											/>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
			{createPortal(
				<EditPanel edit={edit} setEdit={setEdit} />,
				document.body
			)}
		</div>
	);
};
