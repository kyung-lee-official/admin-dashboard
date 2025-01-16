"use client";

import { useAuthStore } from "@/stores/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { googleConsentScreen, signIn } from "@/utils/api/authentication";
import { Button } from "@/components/button/Button";
import { GoogleIcon } from "@/components/icons/Icons";
import { Input } from "@/components/input/Input";
import { motion } from "framer-motion";
import Link from "next/link";

interface IFormInput {
	email: string;
	password: string;
}

const schema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(1, { message: "Required" }),
});

export const Content = () => {
	const router = useRouter();
	const setJwt = useAuthStore((state) => state.setJwt);

	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const mutation = useMutation<any, AxiosError, IFormInput>({
		mutationKey: ["sign-in"],
		mutationFn: (data: IFormInput) => {
			return signIn(data);
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
		mutation.mutate(data);
	};

	useEffect(() => {
		if (mutation.isSuccess) {
			setJwt(mutation.data.jwt);
		}
	}, [mutation]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex justify-center items-center w-full h-svh"
		>
			<div className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
				<h1 className="text-2xl">Sign In</h1>
				<div className="flex flex-col items-center gap-6 w-full">
					<form
						className="flex flex-col gap-6 w-full
						text-sm"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="flex flex-col gap-3 w-full">
							<Input
								placeholder={"Email"}
								isError={!!formState.errors.email}
								isRequired={true}
								errorMessage={formState.errors.email?.message}
								{...register("email")}
								disabled={mutation.isPending}
							/>
							<Input
								placeholder={"Password"}
								isError={!!formState.errors.password}
								isRequired={true}
								errorMessage={
									formState.errors.password?.message
								}
								{...register("password")}
								type="password"
								disabled={mutation.isPending}
							/>
							{mutation.isError &&
								mutation.error.response?.status === 401 && (
									<div className="text-base text-red-500/90">
										Account or password is incorrect
									</div>
								)}
						</div>
						<Button
							type="submit"
							color="default"
							size="sm"
							isLoading={mutation.isPending}
							isDisabled={
								Object.keys(formState.errors).length !== 0
							}
							className="font-semibold w-full"
						>
							Sign In
						</Button>
					</form>
				</div>
				<div className="flex justify-start w-full my-1">
					<button
						className="text-sm dark:text-neutral-300/40"
						onClick={() => {
							router.push("/sign-in/forgetPassword");
						}}
					>
						Forget your password?
					</button>
				</div>
				<div className="flex flex-col w-full gap-4">
					<Button
						size="sm"
						onClick={() => {
							router.push(googleConsentScreen());
						}}
						className="flex justify-center items-center w-full gap-4 py-2
						text-sm
						bg-neutral-50 hover:bg-neutral-100
						rounded-md"
					>
						<GoogleIcon size={20} /> <div>Sign In With Google</div>
					</Button>
					<div className="flex gap-2">
						<div className="text-sm text-neutral-500">
							Need an account?
						</div>
						<Link
							href={"/sign-up"}
							className="text-sm text-lime-600 hover:text-lime-700"
						>
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</motion.div>
	);
};
