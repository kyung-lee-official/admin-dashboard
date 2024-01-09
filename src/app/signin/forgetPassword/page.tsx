"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { forgetPassword } from "@/utils/api/auth";

interface IFormInput {
	email: string;
}

const schema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
});

const Index = () => {
	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const mutation = useMutation<any, AxiosError, IFormInput>({
		mutationKey: ["forgetPassword"],
		mutationFn: (data: IFormInput) => {
			return forgetPassword(data);
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
		mutation.mutate(data);
	};

	return (
		<div className="flex justify-center items-center w-full min-h-screen">
			{mutation.isSuccess ? (
				<div
					className="flex flex-col items-center w-96 px-10 py-6 gap-6
					text-3xl text-gray-600
					bg-gray-200
					rounded-3xl shadow-lg"
				>
					<h1>Email has been sent</h1>
					<h1>✅</h1>
				</div>
			) : (
				<div
					className="flex flex-col items-center w-[450px] px-10 py-6 gap-6
					text-3xl text-gray-600
					bg-gray-200
					rounded-3xl shadow-lg"
				>
					<h1 className="text-3xl">Forget your Password?</h1>
					<div className="flex justify-center text-base text-gray-500">
						Enter your email address and we will send you a link to
						reset your password.
					</div>
					<form
						className="flex flex-col items-center gap-6 w-full"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="input-wrapper-text">
							<input
								className={`input text-base ${
									formState.errors.email && "text-red-400"
								}`}
								{...register("email")}
								placeholder="Email"
								disabled={mutation.isPending}
							/>
							{formState.errors.email && (
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
									{formState.errors.email.message}
								</motion.div>
							)}
							{mutation.error &&
								mutation.error.response?.status === 404 && (
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
										Member not found, please check your email
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
									: "bg-gray-400 cursor-not-allowed"
							}
							rounded`}
							disabled={!formState.isValid || mutation.isPending}
						>
							Send
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Index;
