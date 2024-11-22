"use client";

import { useAuthStore } from "@/stores/auth";
import { setIsFrozenMemberById } from "@/utils/api/members";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

export const UnfreezeMemberDialog = (props: {
	member: any;
	showUnfreezeMemberDialog: boolean;
	setShowUnfreezeMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { member, showUnfreezeMemberDialog, setShowUnfreezeMemberDialog } = props;
	const jwt = useAuthStore((state) => state.jwt);

	const unfreezeMemberDialogRef = useRef<HTMLDialogElement | null>(null);

	const freezeMemberMutation = useMutation({
		mutationFn: async (memberId: string) => {
			return setIsFrozenMemberById(memberId, false, jwt);
		},
		onSuccess: (data) => {
			setShowUnfreezeMemberDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["get-members", jwt],
			});
		},
	});

	useEffect(() => {
		if (showUnfreezeMemberDialog) {
			unfreezeMemberDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showUnfreezeMemberDialog) {
			unfreezeMemberDialogRef.current!.showModal();
		} else {
			unfreezeMemberDialogRef.current!.close();
		}
	}, [showUnfreezeMemberDialog]);

	return (
		<motion.dialog
			ref={unfreezeMemberDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-neutral-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowUnfreezeMemberDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
							text-neutral-600"
			>
				<h1 className="text-lg">Unfreeze Member</h1>
				<div className="flex flex-col items-center gap-2 font-normal">
					<p className="px-4 text-center">
						Are you sure you want to unfreeze member
					</p>
					<p>
						<strong>{member.name}</strong>({member.email})?
					</p>
				</div>
				<div className="flex gap-6">
					<button
						className={
							freezeMemberMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-700/60
							bg-neutral-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-700
							bg-neutral-300 hover:bg-neutral-400 rounded outline-none`
						}
						onClick={() => {
							setShowUnfreezeMemberDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							freezeMemberMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-100
							bg-red-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-100
							bg-red-500 hover:bg-red-600 rounded`
						}
						onClick={() => {
							freezeMemberMutation.mutate(member.id);
						}}
					>
						Unfreeze
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};
