"use client";

import { Button, GoogleIcon } from "@/components";
import { CheckingSeeded } from "@/components/sacl/CheckingSeeded";
import { CheckingSignedIn } from "@/components/sacl/CheckingSignedIn";
import { NetworkError } from "@/components/sacl/NetworkError";
import { signIn } from "@/utilities/api/api";
import { useAuthStore } from "@/stores/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

interface IFormInput {
	email: string;
	password: string;
}

const schema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(1, { message: "Required" }),
});

const SignIn = () => {
	const router = useRouter();
	const setAccessToken = useAuthStore((state) => state.setAccessToken);

	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const mutation = useMutation<any, AxiosError, IFormInput>({
		mutationKey: ["signIn"],
		mutationFn: (data: IFormInput) => {
			return signIn(data);
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
		mutation.mutate(data);
	};

	useEffect(() => {
		if (mutation.isSuccess) {
			setAccessToken(mutation.data.accessToken);
		}
	}, [mutation]);

	return (
		<div
			className="flex flex-col items-center w-96 px-10 py-6
			bg-gray-200
			rounded-3xl shadow-lg"
		>
			<div className="flex flex-col items-center gap-6 w-full">
				<h1>Sign In</h1>
				<form
					className="flex flex-col gap-6 w-full"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="input-wrapper-text">
						<input
							className={`input text-base ${
								formState.errors.email && "text-red-400"
							}`}
							{...register("email")}
							placeholder="Email"
							disabled={mutation.isLoading}
						/>
						<AnimatePresence>
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
									exit={{
										opacity: 0,
										scaleY: 0,
										height: "0rem",
										originY: 0,
									}}
								>
									{formState.errors.email.message}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
					<div className="input-wrapper-text">
						<input
							className="input text-base"
							type="password"
							{...register("password")}
							placeholder="Password"
							disabled={mutation.isLoading}
						/>
						<AnimatePresence>
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
										height: "1rem",
									}}
									exit={{
										opacity: 0,
										scaleY: 0,
										height: "0rem",
										originY: 0,
									}}
								>
									{formState.errors.password.message}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
					{mutation.isError &&
						mutation.error.response?.status === 401 && (
							<div className="text-base text-red-400 font-bold">
								Account or password is incorrect
							</div>
						)}
					<Button
						type="submit"
						disabled={Object.keys(formState.errors).length !== 0}
						isLoading={mutation.isLoading}
					>
						Sign In
					</Button>
				</form>
			</div>
			<div className="flex justify-start w-full my-1">
				<button
					className="text-base font-semibold text-lime-600 hover:text-lime-700"
					onClick={() => {
						router.push("/signin/forgetPassword");
					}}
				>
					Forget your password?
				</button>
			</div>
			<div className="flex flex-col w-full gap-4 mt-4">
				<button
					onClick={() => {
						router.push(
							`${process.env.NEXT_PUBLIC_API_HOST}/auth/google`
						);
					}}
					className="flex justify-center items-center w-full gap-4 py-2
				text-xl
				bg-gray-50 hover:bg-gray-400
				rounded"
				>
					<GoogleIcon size={32} /> <div>Sign In With Google</div>
				</button>
				<div className="flex gap-2">
					<div className="text-base font-semibold text-gray-500">
						Need an account?
					</div>
					<button
						onClick={() => {
							router.push("/signup");
						}}
						className="text-base font-semibold text-lime-600 hover:text-lime-700"
					>
						Sign Up
					</button>
				</div>
			</div>
		</div>
	);
};

const Index = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<SignIn />
		</motion.div>
	);
};

export default Index;
