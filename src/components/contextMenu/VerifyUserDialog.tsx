import { useAuthStore } from "@/stores/auth";
import { verifyUser } from "@/utilities/api/users";
import { queryClient } from "@/utilities/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

const VerifyUserDialog = (props: {
	user: any;
	showVerifyUserDialog: boolean;
	setShowVerifyUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { user, showVerifyUserDialog, setShowVerifyUserDialog } = props;
	const accessToken = useAuthStore((state) => state.accessToken);

	const verifyUserDialogRef = useRef<HTMLDialogElement | null>(null);

	const verifyUserMutation = useMutation({
		mutationFn: async (userId: string) => {
			return verifyUser(userId, accessToken);
		},
		onSuccess: (data) => {
			setShowVerifyUserDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["getUsers", accessToken],
			});
		},
	});

	useEffect(() => {
		if (showVerifyUserDialog) {
			verifyUserDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showVerifyUserDialog) {
			verifyUserDialogRef.current!.showModal();
		} else {
			verifyUserDialogRef.current!.close();
		}
	}, [showVerifyUserDialog]);

	return (
		<motion.dialog
			ref={verifyUserDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-gray-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowVerifyUserDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
				text-gray-600"
			>
				<h1 className="text-lg">Verify User</h1>
				<div className="flex flex-col items-center gap-2  font-normal">
					<p className="px-4 text-center">
						Are you sure you want to verify user{" "}
						<strong>{user.nickname}</strong> ({user.email})
						manually?
					</p>
				</div>
				<div className="flex gap-6">
					<button
						className={
							verifyUserMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-gray-700/60
							bg-gray-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-gray-700
							bg-gray-300 hover:bg-gray-400 rounded outline-none`
						}
						onClick={() => {
							setShowVerifyUserDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							verifyUserMutation.isPending
								? `flex justify-center items-center w-20 h-8
							text-gray-100
							bg-yellow-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-gray-100
							bg-yellow-500 hover:bg-yellow-600 rounded`
						}
						onClick={() => {
							verifyUserMutation.mutate(user.id);
						}}
					>
						Verify
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};

export default VerifyUserDialog;
