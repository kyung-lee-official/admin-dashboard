"use client";

import { useAuthStore } from "@/stores/auth";
import { updateRoleById } from "@/utils/api/roles";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

export const DeleteMemberFromRoleDialog = (props: {
	activeRole: any;
	activeRoleId: number;
	member: any;
	showDeleteMemberDialog: boolean;
	setShowDeleteMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const {
		activeRole,
		activeRoleId,
		member,
		showDeleteMemberDialog,
		setShowDeleteMemberDialog,
	} = props;

	const jwt = useAuthStore((state) => state.jwt);

	const deleteMemberFromRoleDialogRef = useRef<HTMLDialogElement | null>(
		null
	);

	const removeMemberMutation = useMutation({
		mutationFn: async (toBeRemovedMemberId: string) => {
			const newMembers = activeRole.members.filter((member: any) => {
				return member.id !== toBeRemovedMemberId;
			});
			const newMemberIds = newMembers.map((member: any) => member.id);
			return updateRoleById(
				{ memberIds: newMemberIds },
				activeRoleId,
				jwt
			);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getRoles", jwt],
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
			bg-neutral-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowDeleteMemberDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
				text-neutral-600"
			>
				<h1 className="text-lg">Remove Member</h1>
				<div className="font-normal">
					Remove <strong>{member.name}</strong> ({member.email}) from
					role <strong>{activeRole.name}</strong>?
				</div>
				<div className="flex gap-6">
					<button
						className={
							removeMemberMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-700/60
							bg-neutral-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-700
							bg-neutral-300 hover:bg-neutral-400 rounded outline-none`
						}
						onClick={() => {
							setShowDeleteMemberDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							removeMemberMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-100
							bg-red-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-100
							bg-red-500 hover:bg-red-600 rounded`
						}
						onClick={() => {
							removeMemberMutation.mutate(member.id);
						}}
					>
						Remove
					</button>
				</div>
			</div>
		</dialog>
	);
};
