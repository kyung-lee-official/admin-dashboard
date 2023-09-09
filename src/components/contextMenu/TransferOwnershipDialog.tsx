import { useAuthStore } from "@/stores/auth";
import { transferOwnership } from "@/utilities/api/api";
import { queryClient } from "@/utilities/react-query/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useMutation } from "react-query";

export const TransferOwnershipDialog = (props: {
	user: any;
	showTransferOwnershipDialog: boolean;
	setShowTransferOwnershipDialog: React.Dispatch<
		React.SetStateAction<boolean>
	>;
}) => {
	const {
		user,
		showTransferOwnershipDialog,
		setShowTransferOwnershipDialog,
	} = props;
	const accessToken = useAuthStore((state) => state.accessToken);

	const transferOwnershipDialogRef = useRef<HTMLDialogElement | null>(null);

	const transferOwnershipMutation = useMutation({
		mutationFn: async (userId: string) => {
			return transferOwnership(userId, accessToken);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getUsers", accessToken],
			});
			transferOwnershipDialogRef.current!.close();
		},
	});

	useEffect(() => {
		if (showTransferOwnershipDialog) {
			transferOwnershipDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showTransferOwnershipDialog) {
			transferOwnershipDialogRef.current!.showModal();
		} else {
			transferOwnershipDialogRef.current!.close();
		}
	}, [showTransferOwnershipDialog]);

	return (
		<motion.dialog
			ref={transferOwnershipDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-gray-400
			shadow-lg rounded-md backdrop:bg-black/70 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowTransferOwnershipDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center gap-8
				text-gray-600"
			>
				<h1 className="text-lg">Transfer Ownership</h1>
				<div className="font-normal">
					This will transfer the ownership of this server to{" "}
					<strong>{user.nickname}</strong> ({user.email}). This cannot
					be undone!
				</div>
				<div className="flex gap-6">
					<button
						className={
							transferOwnershipMutation.isLoading
								? `flex justify-center items-center w-20 h-8
								text-gray-600
								bg-gray-400 hover:bg-gray-300 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
								text-gray-600
								bg-gray-200 hover:bg-gray-300 rounded outline-none`
						}
						onClick={() => {
							setShowTransferOwnershipDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							transferOwnershipMutation.isLoading
								? `flex justify-center items-center w-fit h-8 px-2
								text-gray-100
								bg-red-500/50 rounded cursor-wait`
								: `flex justify-center items-center w-fit h-8 px-2
								text-gray-100
								bg-red-500 hover:bg-red-600 rounded`
						}
						onClick={() => {
							transferOwnershipMutation.mutate(user.id);
						}}
					>
						Transfer Ownership
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};
