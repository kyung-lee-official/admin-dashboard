"use client";

import { useEffect, useState } from "react";
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
import { MyInfo } from "@/app/settings/my-account/profile/Content";
import { MembersQK, getMyInfo } from "@/utils/api/members";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import { getAllRoles, RolesQK } from "@/utils/api/roles";
import { Dropdown } from "@/components/input/dropdown/Dropdown";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";

export const Content = () => {
	const [role, setRole] = useState<MemberRole | undefined>();
	const [roleOptions, setRoleOptions] = useState<MemberRole[]>([]);
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_TEMPLATE,
	});

	const [iAmAdmin, setIAmAdmin] = useState<boolean>(false);
	const jwt = useAuthStore((state) => state.jwt);
	const myInfoQuery = useQuery<MyInfo, AxiosError>({
		queryKey: [MembersQK.GET_MY_INFO, jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const rolesQuery = useQuery<MemberRole[], AxiosError>({
		queryKey: [RolesQK.GET_ALL_ROLES],
		queryFn: async () => {
			const roles = await getAllRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (myInfoQuery.data) {
			const iAmAdmin = myInfoQuery.data.memberRoles.some(
				(role) => role.id === "admin"
			);
			setIAmAdmin(iAmAdmin);
			if (rolesQuery.data) {
				if (iAmAdmin) {
					setRoleOptions(rolesQuery.data);
				} else {
					const myRoleIds = myInfoQuery.data.memberRoles.map(
						(role) => role.id
					);
					setRoleOptions(
						rolesQuery.data.filter((role) =>
							myRoleIds.includes(role.id)
						)
					);
				}
			}
		}
	}, [myInfoQuery.data, rolesQuery.data]);

	return (
		<PageContainer>
			<PageBlock
				title="Events Template"
				moreMenu={
					iAmAdmin && (
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
					)
				}
			>
				<div
					className="flex items-center px-6 py-4 gap-6
					text-sm
					rounded-md border-t-[1px] border-white/10"
				>
					<Dropdown
						kind="object"
						mode="search"
						selected={role}
						setSelected={setRole}
						options={roleOptions ?? []}
						placeholder="Select a role"
						label={{ primaryKey: "name", secondaryKey: "id" }}
						sortBy="name"
					/>
				</div>
				<TemplateList role={role} />
			</PageBlock>
		</PageContainer>
	);
};
