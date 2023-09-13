"use client";

import React from "react";
import { changePassword } from "@/utilities/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";

interface IFormInput {
	oldPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

const schema = z
	.object({
		oldPassword: z.string().min(1, { message: "Required" }),
		newPassword: z
			.string()
			.min(8, { message: "Must be at least 8 characters" })
			.regex(
				/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
				"Password is too weak, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character"
			),
		confirmNewPassword: z.string().min(1, { message: "Required" }),
	})
	.refine((data) => data.oldPassword !== data.newPassword, {
		message: "New password must be different from old password",
		/* path of error */
		path: ["newPassword"],
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords don't match",
		/* path of error */
		path: ["confirmNewPassword"],
	});

export const ChangePasswordDialog = (props: any) => {
	const { dialogRef, userId, accessToken } = props;
	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const mutation = useMutation<any, AxiosError, IFormInput>({
		mutationKey: "changePassword",
		mutationFn: (data: IFormInput) => {
			return changePassword(userId, data, accessToken);
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
		mutation.mutate(data);
	};

	return (
		<dialog
			ref={dialogRef}
			className="w-[440px]
				bg-gray-300
				shadow-lg rounded-md backdrop-blur-sm
				backdrop:bg-black/50 backdrop:[backdrop-filter:blur(2px)]"
		>
			{mutation.isSuccess ? (
				<div className="flex flex-col items-center gap-6">
					<div>Your password has been updated</div>
					<div className="text-3xl">✅</div>
					<button
						className="w-24 p-2 bg-gray-300 hover:bg-gray-400 rounded"
						onClick={() => {
							mutation.reset();
							if (dialogRef.current) {
								dialogRef.current.close();
							}
						}}
					>
						Close
					</button>
				</div>
			) : (
				<div className="flex flex-col gap-6">
					<div className="flex justify-center font-bold">
						Update your password
					</div>
					<div className="flex justify-center text-base text-gray-500">
						Enter your current password and a new password.
					</div>
					<form
						id="changePasswordForm"
						method="dialog"
						className="flex flex-col gap-6"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="flex flex-col gap-2">
							<div className="text-xs font-bold text-gray-500">
								CURRENT PASSWORD
							</div>
							<input
								type="password"
								className={`h-10 p-2 bg-slate-300 rounded outline-0`}
								{...register("oldPassword")}
								onChange={() => {
									mutation.reset();
								}}
							/>
							{mutation.error &&
								mutation.error.response?.status === 401 && (
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
										exit={{
											opacity: 0,
											scaleY: 0,
											height: "0rem",
											originY: 0,
										}}
									>
										Password is incorrect
									</motion.div>
								)}
						</div>
						<div className="flex flex-col gap-2">
							<div className="text-xs font-bold text-gray-500">
								NEW PASSWORD
							</div>
							<input
								type="password"
								className={`h-10 p-2 ${
									formState.errors.newPassword &&
									"text-red-400"
								} bg-slate-300 rounded outline-0`}
								{...register("newPassword")}
							/>
							{formState.errors.newPassword && (
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
									exit={{
										opacity: 0,
										scaleY: 0,
										height: "0rem",
										originY: 0,
									}}
								>
									{formState.errors.newPassword.message}
								</motion.div>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<div className="text-xs font-bold text-gray-500">
								CONFIRM NEW PASSWORD
							</div>
							<input
								type="password"
								className={`h-10 p-2 ${
									formState.errors.confirmNewPassword &&
									"text-red-400"
								} bg-slate-300 rounded outline-0`}
								{...register("confirmNewPassword")}
							/>
							{formState.errors.confirmNewPassword && (
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
									exit={{
										opacity: 0,
										scaleY: 0,
										height: "0rem",
										originY: 0,
									}}
								>
									{
										formState.errors.confirmNewPassword
											.message
									}
								</motion.div>
							)}
						</div>
					</form>
					<div
						className="flex justify-end items-center gap-4
						text-base font-semibold"
					>
						<button
							className="w-24 p-2 
							bg-gray-300 hover:bg-gray-400
							rounded"
							onClick={() => {
								mutation.reset();
								if (dialogRef.current) {
									dialogRef.current.close();
								}
							}}
						>
							Cancel
						</button>
						<button
							type="submit"
							form="changePasswordForm"
							className={`w-24 p-2
							text-blue-100
							${
								formState.isValid && !mutation.isLoading
									? "bg-blue-500 hover:bg-blue-600"
									: mutation.isLoading
									? "bg-blue-400 cursor-wait"
									: "bg-gray-500 cursor-not-allowed"
							}
							rounded`}
							disabled={!formState.isValid || mutation.isLoading}
						>
							Comfirm
						</button>
					</div>
				</div>
			)}
		</dialog>
	);
};
