"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/input/Input";
import { Button } from "@/components/button/Button";
import { forgetPassword } from "@/utils/api/email";

interface IFormInput {
	email: string;
}

const schema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
});

const Content = () => {
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
		<div className="flex justify-center items-center w-full h-svh">
			{mutation.isSuccess ? (
				<div className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
					<h1 className="text-2xl">Email has been sent ✅</h1>
				</div>
			) : (
				<div className="flex flex-col items-center w-full max-w-[280px] m-4 gap-6">
					<h1 className="text-2xl">Forget your Password?</h1>
					<div className="flex justify-center text-base text-neutral-500">
						Enter your email address and we will send you a link to
						reset your password.
					</div>
					<form
						className="flex flex-col items-center gap-6 w-full"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="w-full">
							<Input
								placeholder={"Email"}
								isError={!!formState.errors.email}
								isRequired={true}
								errorMessage={formState.errors.email?.message}
								{...register("email")}
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
										Member not found, please check your
										email
									</motion.div>
								)}
						</div>
						<Button
							type="submit"
							size="sm"
							className={`text-blue-100
							${
								formState.isValid && !mutation.isPending
									? "bg-blue-500 hover:bg-blue-600"
									: mutation.isPending
									? "bg-blue-400 cursor-wait"
									: "bg-neutral-400 cursor-not-allowed"
							}`}
							disabled={!formState.isValid || mutation.isPending}
						>
							Send
						</Button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Content;
