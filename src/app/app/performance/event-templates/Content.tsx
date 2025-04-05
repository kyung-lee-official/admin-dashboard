"use client";

import { useState } from "react";
import { MemberRole } from "@/utils/types/internal";
import { TemplateList } from "./TemplateList";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { EditIcon } from "@/components/icons/Icons";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import { getMyRoleAndSubRoles, RolesQK } from "@/utils/api/roles";
import { Dropdown } from "@/components/input/dropdown/Dropdown";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";

export const Content = () => {
	const [role, setRole] = useState<MemberRole | undefined>();
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_TEMPLATE,
	});

	const jwt = useAuthStore((state) => state.jwt);
	const myRoleAndSubRolesQuery = useQuery<MemberRole[], AxiosError>({
		queryKey: [RolesQK.GET_MY_ROLE_AND_SUB_ROLES],
		queryFn: async () => {
			const roles = await getMyRoleAndSubRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	return (
		<PageContainer>
			<PageBlock
				title="Events Template"
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								{
									content: "Add Template",
									hideMenuOnClick: true,
									icon: <EditIcon size={15} />,
									onClick: () => {
										setEdit({
											show: true,
											id: EditId.ADD_TEMPLATE,
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
				<div
					className="flex items-center px-6 py-4 gap-6
					text-sm
					rounded-md border-t-[1px] border-white/10"
				>
					{myRoleAndSubRolesQuery.data && (
						<Dropdown
							kind="object"
							mode="search"
							selected={role}
							setSelected={setRole}
							options={myRoleAndSubRolesQuery.data ?? []}
							placeholder="Select a role"
							label={{ primaryKey: "name", secondaryKey: "id" }}
							sortBy="name"
						/>
					)}
				</div>
				<TemplateList role={role} />
			</PageBlock>
		</PageContainer>
	);
};
