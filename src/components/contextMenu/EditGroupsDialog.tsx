"use client";

import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utilities/react-query/react-query";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getGroups } from "@/utilities/api/groups";
import { editUserGroups } from "@/utilities/api/users";
import { SearchOutlineIcon } from "../icons/Icons";
import { CheckboxList } from "../input/CheckboxList";

export const EditGroupsDialog = (props: {
	user: any;
	showEditGroupsDialog: boolean;
	setShowEditGroupsDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { user, showEditGroupsDialog, setShowEditGroupsDialog } = props;
	const accessToken = useAuthStore((state) => state.accessToken);

	const groupsQuery = useQuery<any, AxiosError>({
		queryKey: ["getGroups", accessToken],
		queryFn: async () => {
			const groups = await getGroups(accessToken);
			return groups;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [newUserGroups, setNewUserGroups] = useState(user.groups);
	const [disabledGroupIds, setDisabledGroupIds] = useState<number[]>([]);
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const editGroupsDialogRef = useRef<HTMLDialogElement | null>(null);

	const editGroupsMutation = useMutation({
		mutationFn: async ({
			userId,
			groupIds,
		}: {
			userId: string;
			groupIds: number[];
		}) => {
			return editUserGroups(userId, groupIds, accessToken);
		},
		onSuccess: (data) => {
			setShowEditGroupsDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["getUsers", accessToken],
			});
		},
	});

	useEffect(() => {
		if (showEditGroupsDialog) {
			editGroupsDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showEditGroupsDialog) {
			editGroupsDialogRef.current!.showModal();
		} else {
			editGroupsDialogRef.current!.close();
		}
	}, [showEditGroupsDialog]);

	useEffect(() => {
		setSearchResults(groupsQuery.data);
		if (groupsQuery.data) {
			const disabledGroupIds = groupsQuery.data
				.filter((group: any) => group.name === "everyone")
				.map((group: any) => group.id);
			setDisabledGroupIds(disabledGroupIds);
		}
	}, [groupsQuery.data]);

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (groupsQuery.data) {
			const results = groupsQuery.data.filter((group: any) =>
				group.name.toLowerCase().includes(e.target.value.toLowerCase())
			);
			setSearchResults(results);
		}
	};

	return (
		<motion.dialog
			ref={editGroupsDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-gray-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowEditGroupsDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
				text-gray-600"
			>
				<h1 className="text-lg">Edit Groups</h1>
				<div className="font-normal">
					You&apos;re editing the groups of{" "}
					<strong>{user.nickname}</strong> ({user.email})
				</div>
				<div className="flex w-full font-normal">
					<input
						type="text"
						className="w-full h-10 px-4
						bg-gray-100
						rounded-l placeholder-gray-500 outline-none"
						placeholder="Search groups"
						onChange={onSearch}
					/>
					<div
						className="flex justify-center items-center w-12
						bg-gray-100 rounded-r"
					>
						<SearchOutlineIcon size={28} />
					</div>
				</div>
				<CheckboxList
					allOptions={searchResults}
					newSelectedOptions={newUserGroups}
					setNewSelectedOptions={setNewUserGroups}
					itemKey="name"
					disabledOptionIds={disabledGroupIds}
				/>
				<div className="flex gap-6">
					<button
						className={
							editGroupsMutation.isLoading
								? `flex justify-center items-center w-20 h-8
							text-gray-700/60
							bg-gray-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-gray-700
							bg-gray-300 hover:bg-gray-400 rounded outline-none`
						}
						onClick={() => {
							setShowEditGroupsDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							editGroupsMutation.isLoading
								? `flex justify-center items-center w-20 h-8
							text-gray-100
							bg-blue-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-gray-100
							bg-blue-500 hover:bg-blue-600 rounded`
						}
						onClick={() => {
							const newUserGroupsIds = newUserGroups.map(
								(group: any) => group.id
							);
							editGroupsMutation.mutate({
								userId: user.id,
								groupIds: newUserGroupsIds,
							});
						}}
					>
						Apply
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};
