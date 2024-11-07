"use client";

import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getGroups } from "@/utils/api/groups";
import { editMemberGroups } from "@/utils/api/members";
import { SearchOutlineIcon } from "../icons/Icons";
import { CheckboxList } from "../input/CheckboxList";

export const EditGroupsDialog = (props: {
	member: any;
	showEditGroupsDialog: boolean;
	setShowEditGroupsDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { member, showEditGroupsDialog, setShowEditGroupsDialog } = props;
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

	const [newMemberGroups, setNewMemberGroups] = useState(member.memberGroups);
	const [disabledGroupIds, setDisabledGroupIds] = useState<number[]>([]);
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const editGroupsDialogRef = useRef<HTMLDialogElement | null>(null);

	const editGroupsMutation = useMutation({
		mutationFn: async ({
			memberId,
			groupIds,
		}: {
			memberId: string;
			groupIds: number[];
		}) => {
			return editMemberGroups(memberId, groupIds, accessToken);
		},
		onSuccess: (data) => {
			setShowEditGroupsDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["getMembers", accessToken],
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
			bg-neutral-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowEditGroupsDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
				text-neutral-600"
			>
				<h1 className="text-lg">Edit Groups</h1>
				<div className="font-normal">
					You&apos;re editing the groups of{" "}
					<strong>{member.name}</strong> ({member.email})
				</div>
				<div className="flex w-full font-normal">
					<input
						type="text"
						className="w-full h-10 px-4
						bg-neutral-100
						rounded-l placeholder-neutral-500 outline-none"
						placeholder="Search groups"
						onChange={onSearch}
					/>
					<div
						className="flex justify-center items-center w-12
						bg-neutral-100 rounded-r"
					>
						<SearchOutlineIcon size={28} />
					</div>
				</div>
				<CheckboxList
					allOptions={searchResults}
					newSelectedOptions={newMemberGroups}
					setNewSelectedOptions={setNewMemberGroups}
					itemKey="name"
					disabledOptionIds={disabledGroupIds}
				/>
				<div className="flex gap-6">
					<button
						className={
							editGroupsMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-700/60
							bg-neutral-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-700
							bg-neutral-300 hover:bg-neutral-400 rounded outline-none`
						}
						onClick={() => {
							setShowEditGroupsDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							editGroupsMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-100
							bg-blue-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-100
							bg-blue-500 hover:bg-blue-600 rounded`
						}
						onClick={() => {
							const newMemberGroupsIds = newMemberGroups.map(
								(group: any) => group.id
							);
							editGroupsMutation.mutate({
								memberId: member.id,
								groupIds: newMemberGroupsIds,
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
