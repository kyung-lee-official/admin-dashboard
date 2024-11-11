"use client";

import { useAuthStore } from "@/stores/auth";
import { setIsFrozenMemberById } from "@/utils/api/members";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

export const FreezeMemberDialog = (props: {
	member: any;
	showFreezeMemberDialog: boolean;
	setShowFreezeMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { member, showFreezeMemberDialog, setShowFreezeMemberDialog } = props;
	const jwt = useAuthStore((state) => state.jwt);

	const freezeMemberDialogRef = useRef<HTMLDialogElement | null>(null);

	const freezeMemberMutation = useMutation({
		mutationFn: async (memberId: string) => {
			return setIsFrozenMemberById(memberId, true, jwt);
		},
		onSuccess: (data) => {
			setShowFreezeMemberDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["getMembers", jwt],
			});
		},
	});

	useEffect(() => {
		if (showFreezeMemberDialog) {
			freezeMemberDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showFreezeMemberDialog) {
			freezeMemberDialogRef.current!.showModal();
		} else {
			freezeMemberDialogRef.current!.close();
		}
	}, [showFreezeMemberDialog]);

	return (
		<motion.dialog
			ref={freezeMemberDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-neutral-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowFreezeMemberDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
							text-neutral-600"
			>
				<h1 className="text-lg">Freeze Member</h1>
				<div className="flex flex-col items-center gap-2 font-normal">
					<p className="px-4 text-center">
						Are you sure you want to freeze member
					</p>
					<p>
						<strong>{member.name}</strong>({member.email})?
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
							freezeMemberMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-700/60
							bg-neutral-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-700
							bg-neutral-300 hover:bg-neutral-400 rounded outline-none`
						}
						onClick={() => {
							setShowFreezeMemberDialog(false);
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
						Freeze
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};
