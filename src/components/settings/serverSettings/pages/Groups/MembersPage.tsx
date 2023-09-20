"use client";

import { Avatar } from "@/components/avatar";
import { CircleWithCrossIcon, SearchOutlineIcon } from "@/components/icons";
import { useAuthStore } from "@/stores/auth";
import { updateGroupById } from "@/utilities/api/api";
import { queryClient } from "@/utilities/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import AddMemberToGroupDialog from "./AddMemberToGroupDialog";

export const MembersPage = (props: any) => {
	const { groupsQuery, activeGroupId } = props;
	const accessToken = useAuthStore((state) => state.accessToken);
	const [showAddMemberDialog, setShowAddMemberDialog] =
		useState<boolean>(false);
	const [showDeleteMemberDialog, setShowDeleteMemberDialog] =
		useState<boolean>(false);

	const activeGroup = groupsQuery.data.find((group: any) => {
		return group.id === activeGroupId;
	});

	const removeMemberFromGroupDialogRef = useRef<HTMLDialogElement | null>(
		null
	);

	const removeUserMutation = useMutation({
		mutationFn: async (toBeRemovedUserId: string) => {
			const newUsers = activeGroup.users.filter((user: any) => {
				return user.id !== toBeRemovedUserId;
			});
			const newUserIds = newUsers.map((user: any) => user.id);
			return updateGroupById(
				{ userIds: newUserIds },
				activeGroupId,
				accessToken
			);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getGroups", accessToken],
			});
			setShowDeleteMemberDialog(false);
		},
	});

	useEffect(() => {
		if (removeMemberFromGroupDialogRef.current) {
			if (showDeleteMemberDialog) {
				removeMemberFromGroupDialogRef.current.showModal();
			} else {
				removeMemberFromGroupDialogRef.current.close();
			}
		}
	}, [showDeleteMemberDialog]);

	return (
		<div className="flex flex-col gap-4 py-2">
			<div className="flex justify-between items-center gap-4">
				<div className="flex-1 flex">
					<input
						className="w-full h-8 px-2
						text-gray-600 dark:text-gray-400
						font-medium
						bg-gray-200
						rounded-l outline-none
						placeholder-gray-500 dark:placeholder-gray-400"
						placeholder="Search Members"
					/>
					<div
						className="flex justify-center items-center w-10
						bg-gray-200
						rounded-r"
					>
						<SearchOutlineIcon size={24} />
					</div>
				</div>
				<button
					className="w-28 h-8 bg-blue-500 rounded text-white font-semibold
					hover:bg-blue-600 transition-all duration-300"
					onClick={() => {
						setShowAddMemberDialog(true);
					}}
				>
					Add Members
				</button>
			</div>
			{showAddMemberDialog && (
				<AddMemberToGroupDialog
					activeGroup={activeGroup}
					showAddMemberDialog={showAddMemberDialog}
					setShowAddMemberDialog={setShowAddMemberDialog}
				/>
			)}
			{activeGroup.users.map((user: any) => {
				return (
					<div
						key={user.id}
						className="flex justify-between items-center h-[40px] px-2 py-1
						hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
					>
						<div className="flex items-center gap-4">
							<Avatar
								user={user}
								className="w-6 h-6 rounded-full bg-sky-400"
							/>
							<div className="flex gap-2">
								<div className="text-sm">{user.nickname}</div>
								<div className="text-gray-500 text-sm font-normal">
									{user.email}
								</div>
							</div>
						</div>
						<div
							className="text-gray-400 hover:text-gray-500 cursor-pointer"
							onClick={() => {
								setShowDeleteMemberDialog(true);
							}}
						>
							<CircleWithCrossIcon size={20} />
						</div>
						{showDeleteMemberDialog && (
							<dialog
								ref={removeMemberFromGroupDialogRef}
								className="w-[440px]
								bg-gray-200
								shadow-lg rounded-md backdrop:bg-black/90 backdrop:[backdrop-filter:blur(2px)]"
								onCancel={(
									e: React.SyntheticEvent<
										HTMLDialogElement,
										Event
									>
								) => {
									e.preventDefault();
									setShowDeleteMemberDialog(false);
								}}
							>
								<div
									className="flex flex-col justify-center items-center p-6 gap-8
									text-gray-600"
								>
									<h1 className="text-lg">Remove Member</h1>
									<div className="font-normal">
										Remove <strong>{user.nickname}</strong>{" "}
										({user.email}) from group{" "}
										<strong>{activeGroup.name}</strong>?
									</div>
									<div className="flex gap-6">
										<button
											className={
												removeUserMutation.isLoading
													? `flex justify-center items-center w-20 h-8
												text-gray-700/60
												bg-gray-300/60 rounded outline-none cursor-wait`
													: `flex justify-center items-center w-20 h-8
												text-gray-700
												bg-gray-300 hover:bg-gray-400 rounded outline-none`
											}
											onClick={() => {
												setShowDeleteMemberDialog(
													false
												);
											}}
										>
											Cancel
										</button>
										<button
											className={
												removeUserMutation.isLoading
													? `flex justify-center items-center w-20 h-8
												text-gray-100
												bg-red-500/60 rounded cursor-wait`
													: `flex justify-center items-center w-20 h-8
												text-gray-100
												bg-red-500 hover:bg-red-600 rounded`
											}
											onClick={() => {
												removeUserMutation.mutate(
													user.id
												);
											}}
										>
											Remove
										</button>
									</div>
								</div>
							</dialog>
						)}
					</div>
				);
			})}
		</div>
	);
};
