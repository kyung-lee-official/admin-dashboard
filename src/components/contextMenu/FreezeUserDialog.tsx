"use client";

import { useAuthStore } from "@/stores/auth";
import { freezeUserById } from "@/utilities/api/api";
import { queryClient } from "@/utilities/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

export const FreezeUserDialog = (props: {
	user: any;
	showFreezeUserDialog: boolean;
	setShowFreezeUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { user, showFreezeUserDialog, setShowFreezeUserDialog } = props;
	const accessToken = useAuthStore((state) => state.accessToken);

	const freezeUserDialogRef = useRef<HTMLDialogElement | null>(null);

	const freezeUserMutation = useMutation({
		mutationFn: async (userId: string) => {
			return freezeUserById(userId, accessToken);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getUsers", accessToken],
			});
			freezeUserDialogRef.current!.close();
		},
	});

	useEffect(() => {
		if (showFreezeUserDialog) {
			freezeUserDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showFreezeUserDialog) {
			freezeUserDialogRef.current!.showModal();
		} else {
			freezeUserDialogRef.current!.close();
		}
	}, [showFreezeUserDialog]);

	return (
		<motion.dialog
			ref={freezeUserDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-gray-200
			shadow-lg rounded-md backdrop:bg-black/90 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowFreezeUserDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
							text-gray-600"
			>
				<h1 className="text-lg">Freeze User</h1>
				<div className="flex flex-col items-center gap-2 font-normal">
					<p className="px-4 text-center">
						Are you sure you want to freeze user
					</p>
					<p>
						<strong>{user.nickname}</strong>({user.email})?
					</p>
				</div>
				<img
					src="illustrativeImages/freeze.gif"
					alt="freeze"
					className="rounded"
				/>
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
							setShowFreezeUserDialog(false);
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
						Freeze
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};
