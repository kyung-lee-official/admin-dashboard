"use client";

import { CheckboxList, SearchOutlineIcon } from "@/components";
import { useAuthStore } from "@/stores/auth";
import { updateGroupById } from "@/utilities/api/groups";
import { getUsers } from "@/utilities/api/users";
import { uniq } from "@/utilities/data/data";
import { queryClient } from "@/utilities/react-query/react-query";
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

	const usersQuery = useQuery<any, AxiosError>({
		queryKey: ["getUsers", accessToken],
		queryFn: async () => {
			const users = await getUsers(accessToken);
			return users;
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
				{ userIds: newGroupMemberIds },
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
		if (usersQuery.data) {
			setOriginalGroupMembers(activeGroup.users);
			const selectableUsers = usersQuery.data.filter((user: any) => {
				const originalGroupUserIds = activeGroup.users.map(
					(user: any) => user.id
				);
				return !originalGroupUserIds.includes(user.id);
			});
			setSearchResults(selectableUsers);
		}
	}, [usersQuery.data, activeGroup]);

	useEffect(() => {
		if (showAddMemberDialog) {
			addMemberToGroupDialogRef.current!.showModal();
		} else {
			addMemberToGroupDialogRef.current!.close();
		}
	}, [showAddMemberDialog]);

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (activeGroup) {
			const selectableUsers = usersQuery.data.filter((user: any) => {
				const originalGroupUserIds = activeGroup.users.map(
					(user: any) => user.id
				);
				return !originalGroupUserIds.includes(user.id);
			});
			const results = selectableUsers.filter((user: any) =>
				user.nickname
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
							addMembersMutation.isLoading
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
							addMembersMutation.isLoading
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
									(user: any) => user.id
								);
							const newlySelectedGroupMemberIds: string[] =
								newlySelectedGroupMembers.map(
									(user: any) => user.id
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
