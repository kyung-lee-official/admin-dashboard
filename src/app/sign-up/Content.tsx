"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signUp } from "@/utils/api/authentication";
import {
	getIsSignUpAvailable,
	ServerSettingQK,
} from "@/utils/api/server-settings";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";

interface IFormInput {
	email: string;
	name: string;
	password: string;
	confirmPassword: string;
}

type Data = {
	email: string;
	name: string;
	password: string;
};

const schema = z
	.object({
		email: z.string().email({ message: "Invalid email address" }),
		name: z.string().min(1, { message: "Required" }),
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

const SignUp = () => {
	const router = useRouter();
	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const mutation = useMutation<any, AxiosError, Data>({
		mutationFn: (data: Data) => {
			return signUp(data);
		},
	});

	const onSubmit: SubmitHandler<Data> = async (data: Data) => {
		mutation.mutate(data);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex justify-center items-center w-full h-svh"
		>
			<div className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
				{mutation.isError ? (
					<div
						className="flex flex-col items-center gap-6 w-96
						px-10 py-6"
					>
						<div className="text-4xl">❌</div>
						<div>Unknown Error</div>
						<Button
							size="sm"
							onClick={() => {
								mutation.reset();
							}}
						>
							Go Back
						</Button>
					</div>
				) : mutation.isSuccess ? (
					<div
						className="flex flex-col items-center gap-6 w-96
						px-10 py-6"
					>
						<div className="text-4xl">✅</div>
						<div>Your account has been created.</div>
						<Button
							size="sm"
							onClick={() => {
								router.push("/sign-in");
							}}
						>
							Sign In
						</Button>
					</div>
				) : (
					<div
						className="flex flex-col items-center gap-6 w-96
						px-10 py-6"
					>
						<h1 className="text-2xl">Sign Up</h1>
						<form
							className="flex flex-col gap-6 w-full"
							onSubmit={handleSubmit(onSubmit)}
						>
							<Input
								placeholder={"Email"}
								isError={!!formState.errors.email}
								isRequired={true}
								errorMessage={formState.errors.email?.message}
								{...register("email")}
								disabled={mutation.isPending}
							/>
							<Input
								placeholder={"Name"}
								isError={!!formState.errors.name}
								isRequired={true}
								errorMessage={formState.errors.email?.message}
								{...register("name")}
								disabled={mutation.isPending}
							/>
							<Input
								type="password"
								placeholder={"Password"}
								isError={!!formState.errors.password}
								isRequired={true}
								errorMessage={
									formState.errors.password?.message
								}
								{...register("password")}
								disabled={mutation.isPending}
							/>
							<Input
								type="password"
								placeholder={"Confirm Password"}
								isError={!!formState.errors.confirmPassword}
								isRequired={true}
								errorMessage={
									formState.errors.confirmPassword?.message
								}
								{...register("confirmPassword")}
								disabled={mutation.isPending}
							/>
							<Button
								size="sm"
								type="submit"
								disabled={
									Object.keys(formState.errors).length !== 0
								}
								isLoading={mutation.isPending}
							>
								Sign Up
							</Button>
						</form>
					</div>
				)}
			</div>
		</motion.div>
	);
};

const SignUpNotAvailable = () => {
	return (
		<div
			className="flex flex-col items-center gap-6 w-[100%]
			px-10 py-6"
		>
			<div className="text-6xl">🙅</div>
			<div className="">Sorry, signing-up is not available.</div>
		</div>
	);
};

export const Content = () => {
	const isSignUpAvailableQuery = useQuery<any, AxiosError>({
		queryKey: [ServerSettingQK.GET_IS_SIGN_UP_AVAILABLE],
		queryFn: getIsSignUpAvailable,
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (isSignUpAvailableQuery.isLoading) {
		return <div>Loading...</div>;
	}

	if (isSignUpAvailableQuery.isError) {
		return <div>❗ Network Error</div>;
	}

	if (isSignUpAvailableQuery.data.isSignUpAvailable) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<SignUp />
			</motion.div>
		);
	} else {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<SignUpNotAvailable />
			</motion.div>
		);
	}
};
