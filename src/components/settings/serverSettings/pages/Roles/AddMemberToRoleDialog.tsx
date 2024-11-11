"use client";

import { useAuthStore } from "@/stores/auth";
import { uniq } from "@/utils/data/data";
import { queryClient } from "@/utils/react-query/react-query";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMembers } from "@/utils/api/members";
import { updateRoleById } from "@/utils/api/roles";
import { SearchOutlineIcon } from "@/components/icons/Icons";
import { CheckboxList } from "@/components/input/CheckboxList";

export const AddMemberToRoleDialog = (props: {
	activeRole: any;
	showAddMemberDialog: boolean;
	setShowAddMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { activeRole, showAddMemberDialog, setShowAddMemberDialog } = props;
	const jwt = useAuthStore((state) => state.jwt);
	const [originalRoleMembers, setOriginalRoleMembers] = useState<unknown[]>(
		[]
	);
	const [newlySelectedRoleMembers, setNewlySelectedRoleMembers] = useState<
		unknown[]
	>([]);
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const addMemberToRoleDialogRef = useRef<HTMLDialogElement | null>(null);

	const membersQuery = useQuery<any, AxiosError>({
		queryKey: ["getMembers", jwt],
		queryFn: async () => {
			const members = await getMembers(jwt);
			return members;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const addMembersMutation = useMutation({
		mutationFn: async ({
			newRoleMemberIds,
		}: {
			newRoleMemberIds: string[];
		}) => {
			return updateRoleById(
				{ memberIds: newRoleMemberIds },
				activeRole.id,
				jwt
			);
		},
		onSuccess: (data) => {
			setShowAddMemberDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["getRoles", jwt],
			});
		},
	});

	useEffect(() => {
		if (membersQuery.data) {
			setOriginalRoleMembers(activeRole.members);
			const selectableMembers = membersQuery.data.filter((member: any) => {
				const originalRoleMemberIds = activeRole.members.map(
					(member: any) => member.id
				);
				return !originalRoleMemberIds.includes(member.id);
			});
			setSearchResults(selectableMembers);
		}
	}, [membersQuery.data, activeRole]);

	useEffect(() => {
		if (showAddMemberDialog) {
			addMemberToRoleDialogRef.current!.showModal();
		} else {
			addMemberToRoleDialogRef.current!.close();
		}
	}, [showAddMemberDialog]);

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (activeRole) {
			const selectableMembers = membersQuery.data.filter((member: any) => {
				const originalRoleMemberIds = activeRole.members.map(
					(member: any) => member.id
				);
				return !originalRoleMemberIds.includes(member.id);
			});
			const results = selectableMembers.filter((member: any) =>
				member.name
					.toLowerCase()
					.includes(e.target.value.toLowerCase())
			);
			setSearchResults(results);
		}
	};

	return (
		<dialog
			ref={addMemberToRoleDialogRef}
			className="w-[440px]
			bg-neutral-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowAddMemberDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
				text-neutral-600"
			>
				<h1 className="text-lg">Add Members</h1>
				<div className="font-semibold">{activeRole.name}</div>
				<div className="flex w-full font-normal">
					<input
						type="text"
						className="w-full h-10 px-4
						bg-neutral-100
						rounded-l placeholder-neutral-500 outline-none"
						placeholder="Search members"
						onChange={onSearch}
					/>
					<div
						className="flex justify-center items-center w-12
						bg-neutral-100
						rounded-r"
					>
						<SearchOutlineIcon size={28} />
					</div>
				</div>
				<CheckboxList
					allOptions={searchResults}
					newSelectedOptions={newlySelectedRoleMembers}
					setNewSelectedOptions={setNewlySelectedRoleMembers}
					itemKey="name"
				/>
				<div className="flex gap-6">
					<button
						className={
							addMembersMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-700/60
							bg-neutral-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-700
							bg-neutral-300 hover:bg-neutral-400 rounded outline-none`
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
							text-neutral-100
							bg-blue-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-100
							bg-blue-500 hover:bg-blue-600 rounded`
						}
						onClick={() => {
							const originalRoleMemberIds =
								originalRoleMembers.map((member: any) => member.id);
							const newlySelectedRoleMemberIds: string[] =
								newlySelectedRoleMembers.map(
									(member: any) => member.id
								);

							const newRoleMemberIds: string[] = uniq(
								originalRoleMemberIds.concat(
									newlySelectedRoleMemberIds
								)
							);
							addMembersMutation.mutate({
								newRoleMemberIds: newRoleMemberIds,
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
