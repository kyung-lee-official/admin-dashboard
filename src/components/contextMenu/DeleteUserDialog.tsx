"use client";

import { useAuthStore } from "@/stores/auth";
import { deleteUserById } from "@/utilities/api/api";
import { queryClient } from "@/utilities/react-query/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useMutation } from "react-query";

export const DeleteUserDialog = (props: {
	user: any;
	showDeleteUserDialog: boolean;
	setShowDeleteUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { user, showDeleteUserDialog, setShowDeleteUserDialog } = props;
	const accessToken = useAuthStore((state) => state.accessToken);

	const deleteUserDialogRef = useRef<HTMLDialogElement | null>(null);

	const deleteUserMutation = useMutation({
		mutationFn: async (userId: string) => {
			return deleteUserById(userId, accessToken);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getUsers", accessToken],
			});
			deleteUserDialogRef.current!.close();
		},
	});

	useEffect(() => {
		if (showDeleteUserDialog) {
			deleteUserDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showDeleteUserDialog) {
			deleteUserDialogRef.current!.showModal();
		} else {
			deleteUserDialogRef.current!.close();
		}
	}, [showDeleteUserDialog]);

	return (
		<motion.dialog
			ref={deleteUserDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-gray-400
			shadow-lg rounded-md backdrop:bg-black/70 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowDeleteUserDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center gap-8
				text-gray-600"
			>
				<h1 className="text-lg">Delete User</h1>
				<div className="flex flex-col items-center gap-2  font-normal">
					<p className="px-4 text-center">
						Are you sure you want to delete user
					</p>
					<p>
						<strong>{user.nickname}</strong>({user.email}) ?
					</p>
				</div>
				<div className="flex gap-6">
					<button
						className={
							deleteUserMutation.isLoading
								? `flex justify-center items-center w-20 h-8
								text-gray-600
								bg-gray-400 hover:bg-gray-300 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
								text-gray-600
								bg-gray-200 hover:bg-gray-300 rounded outline-none`
						}
						onClick={() => {
							setShowDeleteUserDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							deleteUserMutation.isLoading
								? `flex justify-center items-center w-20 h-8
								text-gray-100
								bg-red-500/50 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
								text-gray-100
								bg-red-500 hover:bg-red-600 rounded`
						}
						onClick={() => {
							deleteUserMutation.mutate(user.id);
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};
