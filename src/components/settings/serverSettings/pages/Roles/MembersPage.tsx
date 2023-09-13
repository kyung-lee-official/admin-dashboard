"use client";

import { Avatar } from "@/components/avatar";
import { CircleWithCrossIcon, SearchOutlineIcon } from "@/components/icons";
import { useAuthStore } from "@/stores/auth";
import { updateRoleById } from "@/utilities/api/api";
import { queryClient } from "@/utilities/react-query/react-query";
import { useRef, useState } from "react";
import { useMutation } from "react-query";
import { AddMemberToRoleDialog } from "./AddMemberToRoleDialog";

export const MembersPage = (props: any) => {
	const { rolesQuery, activeRoleId } = props;
	const accessToken = useAuthStore((state) => state.accessToken);
	const [showAddMemberDialog, setShowAddMemberDialog] =
		useState<boolean>(false);

	const activeRole = rolesQuery.data.find((role: any) => {
		return role.id === activeRoleId;
	});

	const removeMemberFromRoleDialogRef = useRef<HTMLDialogElement | null>(
		null
	);

	const removeUserMutation = useMutation({
		mutationFn: async (toBeRemovedUserId: string) => {
			const newUsers = activeRole.users.filter((user: any) => {
				return user.id !== toBeRemovedUserId;
			});
			const newUserIds = newUsers.map((user: any) => user.id);
			return updateRoleById(
				{ userIds: newUserIds },
				activeRoleId,
				accessToken
			);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getRoles", accessToken],
			});
			removeMemberFromRoleDialogRef.current!.close();
		},
	});

	return (
		<div className="flex flex-col gap-4 py-2">
			<div className="flex justify-between items-center gap-4">
				<div className="flex-1 flex">
					<input
						className="w-full h-8 px-2
						text-gray-600 dark:text-gray-400
						font-medium
						bg-gray-300
						rounded-l outline-none
						placeholder-gray-500 dark:placeholder-gray-400"
						placeholder="Search Members"
					/>
					<div
						className="flex justify-center items-center w-10
						bg-gray-300
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
				<AddMemberToRoleDialog
					activeRole={activeRole}
					showAddMemberDialog={showAddMemberDialog}
					setShowAddMemberDialog={setShowAddMemberDialog}
				/>
			)}
			{activeRole.users.map((user: any) => {
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
								removeMemberFromRoleDialogRef.current!.showModal();
							}}
						>
							<CircleWithCrossIcon size={20} />
						</div>
						<dialog
							ref={removeMemberFromRoleDialogRef}
							className="w-[440px]
							bg-gray-400
							shadow-lg rounded-md backdrop:bg-black/70 backdrop:[backdrop-filter:blur(2px)]"
						>
							<div
								className="flex flex-col justify-center items-center gap-8
								text-gray-600"
							>
								<h1 className="text-lg">Remove Member</h1>
								<div className="font-normal">
									Remove <strong>{user.nickname}</strong> (
									{user.email}) from role{" "}
									<strong>{activeRole.name}</strong>?
								</div>
								<div className="flex gap-6">
									<button
										className={
											removeUserMutation.isLoading
												? `flex justify-center items-center w-20 h-8
												text-gray-600
												bg-gray-400 hover:bg-gray-300 rounded outline-none cursor-wait`
												: `flex justify-center items-center w-20 h-8
												text-gray-600
												bg-gray-200 hover:bg-gray-300 rounded outline-none`
										}
										onClick={() => {
											removeMemberFromRoleDialogRef.current!.close();
										}}
									>
										Cancel
									</button>
									<button
										className={
											removeUserMutation.isLoading
												? `flex justify-center items-center w-20 h-8
												text-gray-100
												bg-red-500/50 rounded cursor-wait`
												: `flex justify-center items-center w-20 h-8
												text-gray-100
												bg-red-500 hover:bg-red-600 rounded`
										}
										onClick={() => {
											removeUserMutation.mutate(user.id);
										}}
									>
										Remove
									</button>
								</div>
							</div>
						</dialog>
					</div>
				);
			})}
		</div>
	);
};
