"use client";

import { useAuthStore } from "@/stores/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { googleConsentScreen, signIn } from "@/utils/api/auth";
import { Button } from "@/components/button/Button";
import { GoogleIcon } from "@/components/icons/Icons";
import { AuthDialog } from "@/components/sacl/AuthDialog";
import { Input } from "@/components/input/Input";

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
		<AuthDialog title={"Sign In"}>
			<div className="flex flex-col items-center gap-6 w-full">
				<form
					className="flex flex-col gap-4 w-full"
					onSubmit={handleSubmit(onSubmit)}
				>
					<Input
						title={"Email"}
						isInvalid={!!formState.errors.email}
						isRequired={true}
						errorMessage={formState.errors.email?.message}
						{...register("email")}
						disabled={mutation.isPending}
					/>
					<Input
						title={"Password"}
						isInvalid={!!formState.errors.password}
						isRequired={true}
						errorMessage={formState.errors.password?.message}
						{...register("password")}
						type="password"
						placeholder="Password"
						disabled={mutation.isPending}
					/>
					{mutation.isError &&
						mutation.error.response?.status === 401 && (
							<div className="text-base text-red-400 font-bold">
								Account or password is incorrect
							</div>
						)}
					<Button
						type="submit"
						color="primary"
						isLoading={mutation.isPending}
						isDisabled={Object.keys(formState.errors).length !== 0}
						className="font-bold"
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
						router.push(googleConsentScreen());
					}}
					className="flex justify-center items-center w-full gap-4 py-2
					text-xl
					bg-neutral-50 hover:bg-neutral-100
					rounded"
				>
					<GoogleIcon size={32} /> <div>Sign In With Google</div>
				</button>
				<div className="flex gap-2">
					<div className="text-base font-semibold text-neutral-500">
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
		</AuthDialog>
	);
};

const Page = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="flex justify-center items-center w-full h-svh"
		>
			<SignIn />
		</motion.div>
	);
};

export default Page;
