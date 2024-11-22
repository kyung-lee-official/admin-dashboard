import { useAuthStore } from "@/stores/auth";
import { verifyMember } from "@/utils/api/members";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

export const VerifyMemberDialog = (props: {
	member: any;
	showVerifyMemberDialog: boolean;
	setShowVerifyMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { member, showVerifyMemberDialog, setShowVerifyMemberDialog } = props;
	const jwt = useAuthStore((state) => state.jwt);

	const verifyMemberDialogRef = useRef<HTMLDialogElement | null>(null);

	const verifyMemberMutation = useMutation({
		mutationFn: async (memberId: string) => {
			return verifyMember(memberId, jwt);
		},
		onSuccess: (data) => {
			setShowVerifyMemberDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["get-members", jwt],
			});
		},
	});

	useEffect(() => {
		if (showVerifyMemberDialog) {
			verifyMemberDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showVerifyMemberDialog) {
			verifyMemberDialogRef.current!.showModal();
		} else {
			verifyMemberDialogRef.current!.close();
		}
	}, [showVerifyMemberDialog]);

	return (
		<motion.dialog
			ref={verifyMemberDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-neutral-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowVerifyMemberDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
				text-neutral-600"
			>
				<h1 className="text-lg">Verify Member</h1>
				<div className="flex flex-col items-center gap-2  font-normal">
					<p className="px-4 text-center">
						Are you sure you want to verify member{" "}
						<strong>{member.name}</strong> ({member.email})
						manually?
					</p>
				</div>
				<div className="flex gap-6">
					<button
						className={
							verifyMemberMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-700/60
							bg-neutral-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-700
							bg-neutral-300 hover:bg-neutral-400 rounded outline-none`
						}
						onClick={() => {
							setShowVerifyMemberDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							verifyMemberMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-neutral-100
							bg-yellow-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-neutral-100
							bg-yellow-500 hover:bg-yellow-600 rounded`
						}
						onClick={() => {
							verifyMemberMutation.mutate(member.id);
						}}
					>
						Verify
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};
