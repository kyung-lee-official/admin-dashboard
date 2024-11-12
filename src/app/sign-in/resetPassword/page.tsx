"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/utils/api/authentication";

interface IFormInput {
	password: string;
	confirmPassword: string;
}

const schema = z
	.object({
		password: z
			.string()
			.min(8, { message: "Must be at least 8 characters" })
			.regex(
				/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
				"Password is too weak, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character"
			),
		confirmPassword: z.string().min(1, { message: "Required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		/* path of error */
		path: ["confirmPassword"],
	});

const Index = () => {
	const searchParams = useSearchParams();
	// const searchParams = new URLSearchParams(
	// 	router.asPath.substring(router.asPath.indexOf("?"))
	// );
	const resetPasswordToken = searchParams.get("token");

	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const mutation = useMutation<any, AxiosError<any>, IFormInput>({
		mutationKey: ["resetPassword"],
		mutationFn: (data: IFormInput) => {
			return resetPassword({
				password: data.password,
				resetPasswordToken,
			});
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
		mutation.mutate(data);
	};

	useEffect(() => {
		if (mutation.isError) {
			console.error(mutation.error);
		}
	}, [mutation]);

	return (
		<div className="flex justify-center items-center w-full min-h-screen">
			{mutation.isSuccess ? (
				<div
					className="flex flex-col items-center w-[480px] px-10 py-6 gap-6
					text-3xl text-neutral-600
					bg-neutral-200
					rounded-3xl shadow-lg"
				>
					<div>Your password has been reset</div>
					<div>✅</div>
				</div>
			) : mutation.isError &&
			  mutation.error.response?.data?.message === "Invalid token" ? (
				<div
					className="flex flex-col items-center w-[480px] px-10 py-6 gap-6
					text-3xl text-neutral-600
					bg-neutral-200
					rounded-3xl shadow-lg"
				>
					Invalid token ❌
				</div>
			) : (
				<div
					className="flex flex-col items-center w-[480px] px-10 py-6 gap-6
					text-3xl text-neutral-600
					bg-neutral-200
					rounded-3xl shadow-lg"
				>
					<h1 className="text-3xl">Reset your password</h1>
					<div>🗝️</div>
					<form
						className="flex flex-col items-center gap-6 w-full"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="input-wrapper-text">
							<input
								type="password"
								className={`input text-base ${
									formState.errors.password && "text-red-400"
								}`}
								{...register("password")}
								placeholder="New Password"
								disabled={mutation.isPending}
							/>
							{formState.errors.password && (
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
									{formState.errors.password.message}
								</motion.div>
							)}
						</div>
						<div className="input-wrapper-text">
							<input
								type="password"
								className={`input text-base ${
									formState.errors.confirmPassword &&
									"text-red-400"
								}`}
								{...register("confirmPassword")}
								placeholder="Confirm Your New Password"
								disabled={mutation.isPending}
							/>
							{formState.errors.confirmPassword && (
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
										height: "1rem",
									}}
								>
									{formState.errors.confirmPassword.message}
								</motion.div>
							)}
						</div>
						<button
							type="submit"
							className={`w-24 px-2 py-1
							text-xl
							text-blue-100
							${
								formState.isValid && !mutation.isPending
									? "bg-blue-500 hover:bg-blue-600"
									: mutation.isPending
									? "bg-blue-400 cursor-wait"
									: "bg-neutral-400 cursor-not-allowed"
							}
							rounded`}
							disabled={!formState.isValid || mutation.isPending}
						>
							Reset
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Index;
