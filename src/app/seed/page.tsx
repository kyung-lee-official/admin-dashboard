"use client";

import { queryClient } from "@/utils/react-query/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import lottieFiles from "@/components/lottie-animations/animation_congratulations.json";
import { useMutation } from "@tanstack/react-query";
import { googleConsentScreen, seed } from "@/utils/api/auth";
import { Button } from "@/components/button/Button";
import { GoogleIcon } from "@/components/icons/Icons";

interface IFormInput {
	email: string;
	nickname: string;
	password: string;
	confirmPassword: string;
}

type Data = {
	email: string;
	nickname: string;
	password: string;
};

const schema = z
	.object({
		email: z.string().email({ message: "Invalid email address" }),
		nickname: z.string().min(1, { message: "Required" }),
		password: z
			.string()
			.min(1, { message: "Required" })
			.regex(
				/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
				"Password is too weak"
			),
		confirmPassword: z.string().min(1, { message: "Required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		/* path of error */
		path: ["confirmPassword"],
	});

const Seed = () => {
	const router = useRouter();
	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const mutation = useMutation({
		mutationFn: (data: Data) => {
			return seed(data);
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data: Data) => {
		mutation.mutate(data);
	};

	return (
		<div
			className="bg-neutral-200
			rounded-3xl shadow-lg"
		>
			<AnimatePresence mode="wait">
				{mutation.isError ? (
					<motion.div
						key={"success"}
						className="flex flex-col items-center gap-6 w-96
						px-10 py-6"
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0 }}
					>
						<div className="text-4xl">❌</div>
						<div>Unknown Error</div>
						<Button
							onClick={() => {
								mutation.reset();
							}}
						>
							Go Back
						</Button>
					</motion.div>
				) : mutation.isSuccess ? (
					<motion.div
						key={"success"}
						className="relative flex flex-col items-center gap-6 w-96
						px-10 py-6"
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
					>
						<div className="text-2xl">You&apos;ve signed up as</div>
						<div
							className="px-2 py-1
							text-yellow-500
							bg-zinc-900 rounded-md"
						>
							admin
						</div>
						<Button
							onClick={() => {
								queryClient.invalidateQueries({
									queryKey: ["is-seeded"],
								});
							}}
						>
							Sign In
						</Button>
						<div className="absolute top-[-112px] right-0 bottom-28 left-0 pointer-events-none">
							<Lottie
								animationData={lottieFiles}
								loop={false}
								autoplay
							/>
						</div>
					</motion.div>
				) : (
					<motion.div
						key={"form"}
						className="flex flex-col items-center gap-6 w-96
						px-10 py-6"
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
					>
						<h1>Sign Up as admin</h1>
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
									disabled={mutation.isPending}
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
									{...register("nickname")}
									placeholder="Nickname"
									disabled={mutation.isPending}
								/>
								<AnimatePresence>
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
												height: "1rem",
											}}
											exit={{
												opacity: 0,
												scaleY: 0,
												height: "0rem",
												originY: 0,
											}}
										>
											{formState.errors.nickname.message}
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
									disabled={mutation.isPending}
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
							<div className="input-wrapper-text">
								<input
									className="input text-base"
									type="password"
									{...register("confirmPassword")}
									placeholder="Confirm Password"
									disabled={mutation.isPending}
								/>
								<AnimatePresence>
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
											exit={{
												opacity: 0,
												scaleY: 0,
												height: "0rem",
												originY: 0,
											}}
										>
											{
												formState.errors.confirmPassword
													.message
											}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
							<Button
								type="submit"
								disabled={
									Object.keys(formState.errors).length !== 0
								}
								isLoading={mutation.isPending}
							>
								Sign Up
							</Button>
						</form>
						<button
							onClick={() => {
								router.push(googleConsentScreen());
							}}
							className="flex justify-center items-center w-full gap-4 py-2
							text-xl
							bg-neutral-50 hover:bg-neutral-400
							rounded-xl"
						>
							<GoogleIcon size={32} />{" "}
							<div>Sign In With Google</div>
						</button>
					</motion.div>
				)}
			</AnimatePresence>
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
			<Seed />
		</motion.div>
	);
};

export default Index;
