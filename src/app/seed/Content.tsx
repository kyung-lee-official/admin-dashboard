"use client";

import { queryClient } from "@/utils/react-query/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import lottieFiles from "@/components/lottie-animations/animation_congratulations.json";
import { useMutation } from "@tanstack/react-query";
import { googleConsentScreen } from "@/utils/api/authentication";
import { Button } from "@/components/button/Button";
import { GoogleIcon } from "@/components/icons/Icons";
import { Input } from "@/components/input/Input";
import { seed, ServerSettingQK } from "@/utils/api/server-settings";

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

const Seed = () => {
	const router = useRouter();
	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const mutation = useMutation({
		mutationKey: ["seed"],
		mutationFn: (data: Data) => {
			return seed(data);
		},
	});

	const onSubmit: SubmitHandler<IFormInput> = async (data: Data) => {
		mutation.mutate(data);
	};

	if (mutation.isError) {
		return (
			<div className="flex justify-center items-center w-full h-svh">
				<div className="relative flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
					<h1 className="text-2xl">Unknown Error ❌</h1>
					<Button
						onClick={() => {
							mutation.reset();
						}}
					>
						Go Back
					</Button>
				</div>
			</div>
		);
	}

	if (mutation.isSuccess) {
		return (
			<div className="flex justify-center items-center w-full h-svh">
				<div className="relative flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
					<h1 className="text-2xl">You&apos;ve signed up as</h1>
					<div
						className="px-2 py-1
						text-yellow-500
						bg-zinc-900 rounded-md"
					>
						admin
					</div>
					<Button
						size="sm"
						onClick={() => {
							queryClient.invalidateQueries({
								queryKey: [ServerSettingQK.IS_SEEDED],
							});
						}}
					>
						Sign in
					</Button>
					<div className="absolute top-[-112px] right-0 bottom-28 left-0 pointer-events-none">
						<Lottie
							animationData={lottieFiles}
							loop={false}
							autoplay
						/>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-center items-center w-full h-svh">
			<div className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
				<h1 className="text-2xl">Sign Up as Admin</h1>
				<div className="flex flex-col items-center gap-6 w-full">
					<form
						className="flex flex-col gap-6 w-full
						text-sm"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="flex flex-col gap-3 w-full">
							<Input
								placeholder={"Email"}
								isInvalid={!!formState.errors.email}
								isRequired={true}
								errorMessage={formState.errors.email?.message}
								{...register("email")}
								disabled={mutation.isPending}
							/>
							<Input
								placeholder={"Name"}
								isInvalid={!!formState.errors.name}
								isRequired={true}
								errorMessage={formState.errors.name?.message}
								{...register("name")}
								disabled={mutation.isPending}
							/>
							<Input
								type="password"
								placeholder={"Password"}
								isInvalid={!!formState.errors.password}
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
								isInvalid={!!formState.errors.confirmPassword}
								isRequired={true}
								errorMessage={
									formState.errors.confirmPassword?.message
								}
								{...register("confirmPassword")}
								disabled={mutation.isPending}
							/>
						</div>
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
			</div>
		</div>
	);
};

export const Content = () => {
	return <Seed />;
};
