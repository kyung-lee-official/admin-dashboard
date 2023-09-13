"use client";

import { ArrowBackIcon, PlusIcon } from "@/components/icons";
import { SettingsHeading } from "@/components/settings/ContentRegion";
import { createGroup } from "@/utilities/api/api";
import { queryClient } from "@/utilities/react-query/react-query";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { GeneralPage } from "./GeneralPage";
import { MembersPage } from "./MembersPage";

export const Edit = (props: any) => {
	const {
		groupsQuery,
		activeGroupId,
		setActiveGroupId,
		setPage,
		accessToken,
	} = props;

	return (
		<div className="absolute flex top-0 bottom-0 w-[660px]">
			<EditSidebar
				groupsQuery={groupsQuery}
				setPage={setPage}
				activeGroupId={activeGroupId}
				setActiveGroupId={setActiveGroupId}
				accessToken={accessToken}
			/>
			<EditContent
				groupsQuery={groupsQuery}
				activeGroupId={activeGroupId}
			/>
		</div>
	);
};

const EditSidebar = (props: any) => {
	const {
		groupsQuery,
		setPage,
		activeGroupId,
		setActiveGroupId,
		accessToken,
	} = props;

	const createGroupMutation = useMutation({
		mutationFn: async () => {
			return createGroup(accessToken);
		},
		onSuccess: async (group) => {
			await queryClient.invalidateQueries({
				queryKey: ["getGroups", accessToken],
			});
			setActiveGroupId(group.id);
		},
	});

	return (
		<div className="flex-[3] pr-4 pt-12">
			<div className="flex flex-col">
				<div
					className="flex justify-between
					text-gray-600
					text-xl font-normal"
				>
					<div
						className="flex justify-center items-center gap-2 
						cursor-pointer"
						onClick={() => {
							setPage("main");
						}}
					>
						<div>
							<ArrowBackIcon size={24} />
						</div>
						<div>BACK</div>
					</div>
					<div
						className="flex justify-center items-center
						cursor-pointer"
						onClick={() => {
							createGroupMutation.mutate();
						}}
					>
						<PlusIcon size={24} />
					</div>
				</div>
				{groupsQuery.isSuccess && (
					<div className="flex flex-col gap-4 mt-4">
						{groupsQuery.data.map((group: any) => {
							return (
								<div
									key={group.id}
									className={`flex items-center h-[40px] px-4
									text-base font-normal
									${activeGroupId === group.id && "bg-gray-300"} hover:bg-gray-300
									rounded cursor-pointer`}
									onClick={() => {
										setActiveGroupId(group.id);
									}}
								>
									{group.name}
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
	const { groupsQuery, activeGroupId } = props;
	const [activeTabTitle, setActiveTabTitle] = useState<"General" | "Members">(
		"General"
	);

	return (
		<div
			className="flex-[7] flex flex-col gap-6 px-4 pt-12
			border-l-[1px] border-gray-400"
		>
			<SettingsHeading>Edit Groups</SettingsHeading>
			<ContentTabs
				activeTabTitle={activeTabTitle}
				setActiveTabTitle={setActiveTabTitle}
			/>
			<Content
				groupsQuery={groupsQuery}
				activeGroupId={activeGroupId}
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
			<div className="flex-1 border-b-[2px] border-gray-400"></div>
			<Tab
				title={"Members"}
				activeTabTitle={activeTabTitle}
				setActiveTabTitle={setActiveTabTitle}
			/>
		</div>
	);
};

const Content = (props: any) => {
	const { groupsQuery, activeGroupId, activeTabTitle } = props;

	switch (activeTabTitle) {
		case "General":
			return (
				<GeneralPage
					groupsQuery={groupsQuery}
					activeGroupId={activeGroupId}
				/>
			);
			break;
		case "Members":
			return (
				<MembersPage
					groupsQuery={groupsQuery}
					activeGroupId={activeGroupId}
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
			text-gray-600
			border-b-[2px] ${
				title === activeTabTitle ? "border-blue-500" : "border-gray-400"
			} cursor-pointer select-none`}
			onClick={() => {
				setActiveTabTitle(title);
			}}
		>
			{title}
		</div>
	);
};
