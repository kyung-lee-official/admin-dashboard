import { useAuthStore } from "@/stores/auth";
import { updateProfile } from "@/utils/api/members";
import { queryClient } from "@/utils/react-query/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

interface IFormInput {
	name: string;
}

const schema = z.object({
	name: z.string().trim().min(1, { message: "Required" }),
});

export const ChangeNameDialog = (props: {
	member: any;
	showChangeNameDialog: boolean;
	setShowChangeNameDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { member, showChangeNameDialog, setShowChangeNameDialog } =
		props;
	const accessToken = useAuthStore((state) => state.accessToken);

	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const changeNameDialogRef = useRef<HTMLDialogElement | null>(null);

	const changeNameMutation = useMutation<
		any,
		AxiosError<any>,
		IFormInput
	>({
		mutationFn: async (data: IFormInput) => {
			const { name } = data;
			return updateProfile(member.id, name, accessToken);
		},
		onSuccess: (data) => {
			setShowChangeNameDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["my-info", jwt],
			});
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
		changeNameMutation.reset();
		changeNameMutation.mutate(data);
	};

	useEffect(() => {
		if (showChangeNameDialog) {
			changeNameDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showChangeNameDialog) {
			changeNameDialogRef.current!.showModal();
		} else {
			changeNameDialogRef.current!.close();
		}
	}, [showChangeNameDialog]);

	return (
		<motion.dialog
			ref={changeNameDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-neutral-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowChangeNameDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-8
				text-neutral-600"
			>
				<h1 className="text-lg">Change Name</h1>
				<h1 className="flex justify-center text-base text-neutral-500">
					Enter your new name
				</h1>
				<form
					id="changeNameForm"
					method="dialog"
					className="flex flex-col gap-6"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="flex flex-col gap-2">
						<input
							type="text"
							defaultValue={member.name}
							className={`h-10 p-2 bg-slate-300 rounded outline-0`}
							{...register("name")}
						/>
						{formState.errors.name && (
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
								{formState.errors.name.message}
							</motion.div>
						)}
						{changeNameMutation.isError && (
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
								changeNameMutation.isPending
									? `flex justify-center items-center w-20 h-8
							text-neutral-700/60
							bg-neutral-300/60 rounded outline-none cursor-wait`
									: `flex justify-center items-center w-20 h-8
							text-neutral-700
							bg-neutral-300 hover:bg-neutral-400 rounded outline-none`
							}
							onClick={() => {
								setShowChangeNameDialog(false);
							}}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={
								changeNameMutation.isPending
									? `flex justify-center items-center w-20 h-8
									text-neutral-100
									bg-blue-500/60 rounded cursor-wait`
									: formState.isValid
									? `flex justify-center items-center w-20 h-8
									text-neutral-100
									bg-blue-500 hover:bg-blue-600 rounded`
									: `flex justify-center items-center w-20 h-8
									text-neutral-100
									bg-blue-500/60 rounded cursor-not-allowed`
							}
							disabled={
								!formState.isValid ||
								changeNameMutation.isPending
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
