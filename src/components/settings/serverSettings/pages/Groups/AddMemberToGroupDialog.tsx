"use client";

import { SearchOutlineIcon } from "@/components/icons/Icons";
import { CheckboxList } from "@/components/input/CheckboxList";
import { useAuthStore } from "@/stores/auth";
import { updateGroupById } from "@/utils/api/groups";
import { getMembers } from "@/utils/api/members";
import { uniq } from "@/utils/data/data";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

const AddMemberToGroupDialog = (props: {
	activeGroup: any;
	showAddMemberDialog: boolean;
	setShowAddMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { activeGroup, showAddMemberDialog, setShowAddMemberDialog } = props;
	const accessToken = useAuthStore((state) => state.accessToken);
	const [originalGroupMembers, setOriginalGroupMembers] = useState<unknown[]>(
		[]
	);
	const [newlySelectedGroupMembers, setNewlySelectedGroupMembers] = useState<
		unknown[]
	>([]);
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const addMemberToGroupDialogRef = useRef<HTMLDialogElement | null>(null);

	const membersQuery = useQuery<any, AxiosError>({
		queryKey: ["getMembers", accessToken],
		queryFn: async () => {
			const members = await getMembers(accessToken);
			return members;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const addMembersMutation = useMutation({
		mutationFn: async ({
			newGroupMemberIds,
		}: {
			newGroupMemberIds: string[];
		}) => {
			return updateGroupById(
				{ memberIds: newGroupMemberIds },
				activeGroup.id,
				accessToken
			);
		},
		onSuccess: (data) => {
			setShowAddMemberDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["getGroups", accessToken],
			});
		},
	});

	useEffect(() => {
		if (membersQuery.data) {
			setOriginalGroupMembers(activeGroup.members);
			const selectableMembers = membersQuery.data.filter((member: any) => {
				const originalGroupMemberIds = activeGroup.members.map(
					(member: any) => member.id
				);
				return !originalGroupMemberIds.includes(member.id);
			});
			setSearchResults(selectableMembers);
		}
	}, [membersQuery.data, activeGroup]);

	useEffect(() => {
		if (showAddMemberDialog) {
			addMemberToGroupDialogRef.current!.showModal();
		} else {
			addMemberToGroupDialogRef.current!.close();
		}
	}, [showAddMemberDialog]);

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (activeGroup) {
			const selectableMembers = membersQuery.data.filter((member: any) => {
				const originalGroupMemberIds = activeGroup.members.map(
					(member: any) => member.id
				);
				return !originalGroupMemberIds.includes(member.id);
			});
			const results = selectableMembers.filter((member: any) =>
				member.nickname
					.toLowerCase()
					.includes(e.target.value.toLowerCase())
			);
			setSearchResults(results);
		}
	};

	return (
		<dialog
			ref={addMemberToGroupDialogRef}
			className="w-[440px]
			bg-gray-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowAddMemberDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
				text-gray-600"
			>
				<h1 className="text-lg">Add Members</h1>
				<div className="font-semibold">{activeGroup.name}</div>
				<div className="flex w-full font-normal">
					<input
						type="text"
						className="w-full h-10 px-4
						bg-gray-100
						rounded-l placeholder-gray-500 outline-none"
						placeholder="Search members"
						onChange={onSearch}
					/>
					<div
						className="flex justify-center items-center w-12
						bg-gray-100
						rounded-r"
					>
						<SearchOutlineIcon size={28} />
					</div>
				</div>
				<CheckboxList
					allOptions={searchResults}
					newSelectedOptions={newlySelectedGroupMembers}
					setNewSelectedOptions={setNewlySelectedGroupMembers}
					itemKey="nickname"
				/>
				<div className="flex gap-6">
					<button
						className={
							addMembersMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-gray-700/60
							bg-gray-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-gray-700
							bg-gray-300 hover:bg-gray-400 rounded outline-none`
						}
						onClick={() => {
							setShowAddMemberDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							addMembersMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-gray-100
							bg-blue-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-gray-100
							bg-blue-500 hover:bg-blue-600 rounded`
						}
						onClick={() => {
							const originalGroupMemberIds =
								originalGroupMembers.map(
									(member: any) => member.id
								);
							const newlySelectedGroupMemberIds: string[] =
								newlySelectedGroupMembers.map(
									(member: any) => member.id
								);

							const newGroupMemberIds: string[] = uniq(
								originalGroupMemberIds.concat(
									newlySelectedGroupMemberIds
								)
							);
							addMembersMutation.mutate({
								newGroupMemberIds: newGroupMemberIds,
							});
						}}
					>
						Add
					</button>
				</div>
			</div>
		</dialog>
	);
};

export default AddMemberToGroupDialog;
