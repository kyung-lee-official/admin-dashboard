"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/utils/api/authentication";
import { Suspense, useEffect } from "react";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";

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

const ContentWrapper = () => {
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
		<div className="flex justify-center items-center w-full h-svh">
			{mutation.isSuccess ? (
				<div className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
					<h1 className="text-2xl">
						Your password has been reset ✅
					</h1>
				</div>
			) : mutation.isError &&
			  mutation.error.response?.data?.message === "Invalid token" ? (
				<div className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
					Invalid token ❌
				</div>
			) : (
				<div className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
					<h1 className="text-2xl">Reset your password 🗝️</h1>
					<form
						className="flex flex-col items-center gap-6 w-full"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="w-full">
							<Input
								type="password"
								className={`input text-base ${
									formState.errors.password && "text-red-400"
								}`}
								isError={!!formState.errors.password}
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
						<div className="w-full">
							<Input
								type="password"
								className={`input text-base ${
									formState.errors.confirmPassword &&
									"text-red-400"
								}`}
								isError={!!formState.errors.confirmPassword}
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
						<Button
							size="sm"
							type="submit"
							className={`
							${
								formState.isValid && !mutation.isPending
									? "bg-blue-500 hover:bg-blue-600"
									: mutation.isPending
									? "bg-blue-400 cursor-wait"
									: "bg-neutral-400 cursor-not-allowed"
							}`}
							disabled={!formState.isValid || mutation.isPending}
						>
							Reset
						</Button>
					</form>
				</div>
			)}
		</div>
	);
};

const Content = () => {
	return (
		<Suspense>
			<ContentWrapper />
		</Suspense>
	);
};

export default Content;
