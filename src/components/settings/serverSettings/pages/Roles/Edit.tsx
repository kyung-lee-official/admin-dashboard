"use client";

import { SettingsHeading } from "@/components/settings/ContentRegion";
import { useState } from "react";
import { GeneralPage } from "./GeneralPage";
import { PermissionsPage } from "./PermissionsPage";
import { MembersPage } from "./MembersPage";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { createRole } from "@/utils/api/roles";
import { ArrowBackIcon, PlusIcon } from "@/components/icons/Icons";

export const Edit = (props: any) => {
	const { rolesQuery, activeRoleId, setActiveRoleId, setPage, jwt } =
		props;

	return (
		<div className="absolute flex top-0 bottom-0 w-[660px]">
			<EditSidebar
				rolesQuery={rolesQuery}
				setPage={setPage}
				activeRoleId={activeRoleId}
				setActiveRoleId={setActiveRoleId}
				jwt={jwt}
			/>
			<EditContent rolesQuery={rolesQuery} activeRoleId={activeRoleId} />
		</div>
	);
};

const EditSidebar = (props: any) => {
	const { rolesQuery, setPage, activeRoleId, setActiveRoleId, jwt } =
		props;

	const createRoleMutation = useMutation({
		mutationFn: async () => {
			return createRole(jwt);
		},
		onSuccess: async (role) => {
			await queryClient.invalidateQueries({
				queryKey: ["get-roles", jwt],
			});
			setActiveRoleId(role.id);
		},
	});

	return (
		<div className="flex-[3] pr-4 pt-12">
			<div className="flex flex-col">
				<div
					className="flex justify-between
					text-neutral-600
					text-xl font-normal"
				>
					<button
						className="flex justify-center items-center gap-2 
						hover:text-neutral-800
						cursor-pointer"
						onClick={() => {
							setPage("main");
						}}
					>
						<div>
							<ArrowBackIcon size={24} />
						</div>
						<div>BACK</div>
					</button>
					<button
						className="flex justify-center items-center
						hover:text-neutral-800
						cursor-pointer"
						onClick={() => {
							createRoleMutation.mutate();
						}}
					>
						<PlusIcon size={24} />
					</button>
				</div>
				{rolesQuery.isSuccess && (
					<div className="flex flex-col gap-4 mt-4">
						{rolesQuery.data.map((role: any) => {
							return (
								<div
									key={role.id}
									className={`flex items-center min-h-[40px] px-4
									text-base font-normal
									${activeRoleId === role.id && "bg-neutral-200"} hover:bg-neutral-100
									rounded cursor-pointer`}
									onClick={() => {
										setActiveRoleId(role.id);
									}}
								>
									{role.name}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

const EditContent = (props: any) => {
	const { rolesQuery, activeRoleId } = props;
	const [activeTabTitle, setActiveTabTitle] = useState<
		"General" | "Permissions" | "Members"
	>("General");

	return (
		<div
			className="flex-[7] flex flex-col gap-6 px-4 pt-12
			border-l-[1px] border-neutral-400"
		>
			<SettingsHeading>Edit Roles</SettingsHeading>
			<ContentTabs
				activeTabTitle={activeTabTitle}
				setActiveTabTitle={setActiveTabTitle}
			/>
			<Content
				rolesQuery={rolesQuery}
				activeRoleId={activeRoleId}
				activeTabTitle={activeTabTitle}
			/>
		</div>
	);
};

const ContentTabs = (props: any) => {
	const { activeTabTitle, setActiveTabTitle } = props;

	return (
		<div className="flex justify-between min-h-[40px]">
			<Tab
				title={"General"}
				activeTabTitle={activeTabTitle}
				setActiveTabTitle={setActiveTabTitle}
			/>
			<div className="flex-1 border-b-[2px] border-neutral-400"></div>
			<Tab
				title={"Permissions"}
				activeTabTitle={activeTabTitle}
				setActiveTabTitle={setActiveTabTitle}
			/>
			<div className="flex-1 border-b-[2px] border-neutral-400"></div>
			<Tab
				title={"Members"}
				activeTabTitle={activeTabTitle}
				setActiveTabTitle={setActiveTabTitle}
			/>
		</div>
	);
};

const Content = (props: any) => {
	const { rolesQuery, activeRoleId, activeTabTitle } = props;

	switch (activeTabTitle) {
		case "General":
			return (
				<GeneralPage
					rolesQuery={rolesQuery}
					activeRoleId={activeRoleId}
				/>
			);
			break;
		case "Permissions":
			return (
				<PermissionsPage
					rolesQuery={rolesQuery}
					activeRoleId={activeRoleId}
				/>
			);
			break;
		case "Members":
			return (
				<MembersPage
					rolesQuery={rolesQuery}
					activeRoleId={activeRoleId}
				/>
			);
			break;
		default:
			return null;
			break;
	}
};

const Tab = (props: any) => {
	const { title, activeTabTitle, setActiveTabTitle } = props;
	return (
		<div
			className={`flex items-center
			text-neutral-600
			border-b-[2px] ${
				title === activeTabTitle ? "border-blue-500" : "border-neutral-400"
			} cursor-pointer select-none`}
			onClick={() => {
				setActiveTabTitle(title);
			}}
		>
			{title}
		</div>
	);
};
