"use client";

import { useAuthStore } from "@/stores/auth";
import { setIsFrozenUserById } from "@/utilities/api/users";
import { queryClient } from "@/utilities/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

export const UnfreezeUserDialog = (props: {
	user: any;
	showUnfreezeUserDialog: boolean;
	setShowUnfreezeUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { user, showUnfreezeUserDialog, setShowUnfreezeUserDialog } = props;
	const accessToken = useAuthStore((state) => state.accessToken);

	const unfreezeUserDialogRef = useRef<HTMLDialogElement | null>(null);

	const freezeUserMutation = useMutation({
		mutationFn: async (userId: string) => {
			return setIsFrozenUserById(userId, false, accessToken);
		},
		onSuccess: (data) => {
			setShowUnfreezeUserDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["getUsers", accessToken],
			});
		},
	});

	useEffect(() => {
		if (showUnfreezeUserDialog) {
			unfreezeUserDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showUnfreezeUserDialog) {
			unfreezeUserDialogRef.current!.showModal();
		} else {
			unfreezeUserDialogRef.current!.close();
		}
	}, [showUnfreezeUserDialog]);

	return (
		<motion.dialog
			ref={unfreezeUserDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-gray-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowUnfreezeUserDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
							text-gray-600"
			>
				<h1 className="text-lg">Unfreeze User</h1>
				<div className="flex flex-col items-center gap-2 font-normal">
					<p className="px-4 text-center">
						Are you sure you want to unfreeze user
					</p>
					<p>
						<strong>{user.nickname}</strong>({user.email})?
					</p>
				</div>
				<div className="flex gap-6">
					<button
						className={
							freezeUserMutation.isLoading
								? `flex justify-center items-center w-20 h-8
							text-gray-700/60
							bg-gray-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-gray-700
							bg-gray-300 hover:bg-gray-400 rounded outline-none`
						}
						onClick={() => {
							setShowUnfreezeUserDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							freezeUserMutation.isLoading
								? `flex justify-center items-center w-20 h-8
							text-gray-100
							bg-red-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-gray-100
							bg-red-500 hover:bg-red-600 rounded`
						}
						onClick={() => {
							freezeUserMutation.mutate(user.id);
						}}
					>
						Unfreeze
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};
