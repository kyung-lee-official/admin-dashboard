"use client";

import { useAuthStore } from "@/stores/auth";
import { transferOwnership } from "@/utils/api/members";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

export const TransferOwnershipDialog = (props: {
	member: any;
	showTransferOwnershipDialog: boolean;
	setShowTransferOwnershipDialog: React.Dispatch<
		React.SetStateAction<boolean>
	>;
	setActivePath: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const {
		member,
		showTransferOwnershipDialog,
		setShowTransferOwnershipDialog,
		setActivePath,
	} = props;
	const accessToken = useAuthStore((state) => state.accessToken);

	const transferOwnershipDialogRef = useRef<HTMLDialogElement | null>(null);

	const transferOwnershipMutation = useMutation({
		mutationFn: async (memberId: string) => {
			return transferOwnership(memberId, accessToken);
		},
		onSuccess: (data) => {
			setShowTransferOwnershipDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["getMembers", accessToken],
			});
			queryClient.invalidateQueries({
				queryKey: ["myInfo", accessToken],
			});
			setActivePath("/serverSettings/overview");
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
			bg-neutral-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowTransferOwnershipDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
				text-neutral-600"
			>
				<h1 className="text-lg">Transfer Ownership</h1>
				<div className="font-normal">
					This will transfer the ownership of this server and the
					ownership of the{" "}
					<span className="p-[2px] text-neutral-700 bg-neutral-300 rounded">
						everyone
					</span>{" "}
					group to <strong>{member.nickname}</strong> ({member.email}).
					This cannot be undone!
				</div>
				<div className="flex gap-6">
					<button
						className={
							transferOwnershipMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-700/60
							bg-neutral-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-700
							bg-neutral-300 hover:bg-neutral-400 rounded outline-none`
						}
						onClick={() => {
							setShowTransferOwnershipDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							transferOwnershipMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-100
							bg-red-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-40 h-8
							text-neutral-100
							bg-red-500 hover:bg-red-600 rounded`
						}
						onClick={() => {
							transferOwnershipMutation.mutate(member.id);
						}}
					>
						Transfer Ownership
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};
