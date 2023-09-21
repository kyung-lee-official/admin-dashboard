"use client";

import { useAuthStore } from "@/stores/auth";
import { updateRoleById } from "@/utilities/api/roles";
import { queryClient } from "@/utilities/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

export const DeleteMemberFromRoleDialog = (props: {
	activeRole: any;
	activeRoleId: number;
	user: any;
	showDeleteMemberDialog: boolean;
	setShowDeleteMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const {
		activeRole,
		activeRoleId,
		user,
		showDeleteMemberDialog,
		setShowDeleteMemberDialog,
	} = props;

	const accessToken = useAuthStore((state) => state.accessToken);

	const deleteMemberFromRoleDialogRef = useRef<HTMLDialogElement | null>(
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
			setShowDeleteMemberDialog(false);
		},
	});

	useEffect(() => {
		if (deleteMemberFromRoleDialogRef.current) {
			if (showDeleteMemberDialog) {
				deleteMemberFromRoleDialogRef.current.showModal();
			} else {
				deleteMemberFromRoleDialogRef.current.close();
			}
		}
	}, [showDeleteMemberDialog]);

	return (
		<dialog
			ref={deleteMemberFromRoleDialogRef}
			className="w-[440px]
			bg-gray-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
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
					Remove <strong>{user.nickname}</strong> ({user.email}) from
					role <strong>{activeRole.name}</strong>?
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
							setShowDeleteMemberDialog(false);
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
							removeUserMutation.mutate(user.id);
						}}
					>
						Remove
					</button>
				</div>
			</div>
		</dialog>
	);
};
