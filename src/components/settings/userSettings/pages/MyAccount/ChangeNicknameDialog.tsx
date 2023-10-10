import { useAuthStore } from "@/stores/auth";
import { updateProfile } from "@/utilities/api/users";
import { queryClient } from "@/utilities/react-query/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

interface IFormInput {
	nickname: string;
}

const schema = z.object({
	nickname: z.string().trim().min(1, { message: "Required" }),
});

export const ChangeNicknameDialog = (props: {
	user: any;
	showChangeNicknameDialog: boolean;
	setShowChangeNicknameDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { user, showChangeNicknameDialog, setShowChangeNicknameDialog } =
		props;
	const accessToken = useAuthStore((state) => state.accessToken);

	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const changeNicknameDialogRef = useRef<HTMLDialogElement | null>(null);

	const changeNicknameMutation = useMutation<
		any,
		AxiosError<any>,
		IFormInput
	>({
		mutationFn: async (data: IFormInput) => {
			const { nickname } = data;
			return updateProfile(user.id, nickname, accessToken);
		},
		onSuccess: (data) => {
			setShowChangeNicknameDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["myInfo", accessToken],
			});
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
		changeNicknameMutation.reset();
		changeNicknameMutation.mutate(data);
	};

	useEffect(() => {
		if (showChangeNicknameDialog) {
			changeNicknameDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showChangeNicknameDialog) {
			changeNicknameDialogRef.current!.showModal();
		} else {
			changeNicknameDialogRef.current!.close();
		}
	}, [showChangeNicknameDialog]);

	return (
		<motion.dialog
			ref={changeNicknameDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-gray-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowChangeNicknameDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
				text-gray-600"
			>
				<h1 className="text-lg">Change Nickname</h1>
				<h1 className="flex justify-center text-base text-gray-500">
					Enter your new nickname
				</h1>
				<form
					id="changePasswordForm"
					method="dialog"
					className="flex flex-col gap-6"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="flex flex-col gap-2">
						<input
							type="text"
							defaultValue={user.nickname}
							className={`h-10 p-2 bg-slate-300 rounded outline-0`}
							{...register("nickname")}
						/>
						{formState.errors.nickname && (
							<motion.div
								className="text-base text-red-400 font-bold"
								initial={{
									opacity: 0,
									scaleY: 0,
									height: "0rem",
									originY: 0,
								}}
								animate={{
									opacity: 1,
									scaleY: 1,
									height: "auto",
								}}
							>
								{formState.errors.nickname.message}
							</motion.div>
						)}
						{changeNicknameMutation.isError && (
							<motion.div
								className="text-base text-red-400 font-semibold"
								initial={{
									opacity: 0,
									scaleY: 0,
									height: "0rem",
									originY: 0,
								}}
								animate={{
									opacity: 1,
									scaleY: 1,
									height: "auto",
								}}
							>
								Something went wrong...
							</motion.div>
						)}
					</div>
					<div
						className="flex justify-center items-center gap-6
						text-base font-semibold"
					>
						<button
							className={
								changeNicknameMutation.isLoading
									? `flex justify-center items-center w-20 h-8
							text-gray-700/60
							bg-gray-300/60 rounded outline-none cursor-wait`
									: `flex justify-center items-center w-20 h-8
							text-gray-700
							bg-gray-300 hover:bg-gray-400 rounded outline-none`
							}
							onClick={() => {
								setShowChangeNicknameDialog(false);
							}}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={
								changeNicknameMutation.isLoading
									? `flex justify-center items-center w-20 h-8
									text-gray-100
									bg-blue-500/60 rounded cursor-wait`
									: formState.isValid
									? `flex justify-center items-center w-20 h-8
									text-gray-100
									bg-blue-500 hover:bg-blue-600 rounded`
									: `flex justify-center items-center w-20 h-8
									text-gray-100
									bg-blue-500/60 rounded cursor-not-allowed`
							}
							disabled={
								!formState.isValid ||
								changeNicknameMutation.isLoading
							}
						>
							Confirm
						</button>
					</div>
				</form>
			</div>
		</motion.dialog>
	);
};
