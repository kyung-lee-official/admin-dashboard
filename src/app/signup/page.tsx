import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Button, SaclContext } from "@/components";
import { CheckingSeeded } from "@/components/sacl/CheckingSeeded";
import { NetworkError } from "@/components/sacl/NetworkError";
import { CheckingSignedIn } from "@/components/sacl/CheckingSignedIn";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "react-query";
import { getIsSignUpAvailable, signUp } from "@/utilities/api/api";
import { AxiosError } from "axios";

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

const SignUp = () => {
	const router = useRouter();
	const { register, handleSubmit, formState } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	const mutation = useMutation<any, AxiosError, Data>({
		mutationKey: "signUp",
		mutationFn: (data: Data) => {
			return signUp(data);
		},
	});

	const onSubmit: SubmitHandler<Data> = async (data: Data) => {
		mutation.mutate(data);
	};

	return (
		<div
			className="bg-gray-200
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
						className="flex flex-col items-center gap-6 w-96
						px-10 py-6"
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
					>
						<div className="text-4xl">✅</div>
						<div>You&apos;ve signed up as admin 🎉🎉🎉</div>
						<Button
							onClick={() => {
								router.push("/signin");
							}}
						>
							Sign In
						</Button>
					</motion.div>
				) : (
					<motion.div
						key={"form"}
						className="flex flex-col items-center gap-6 w-96
						px-10 py-6"
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
					>
						<h1>Sign Up</h1>
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
									{...register("nickname")}
									placeholder="Nickname"
									disabled={mutation.isLoading}
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
							<div className="input-wrapper-text">
								<input
									className="input text-base"
									type="password"
									{...register("confirmPassword")}
									placeholder="Confirm Password"
									disabled={mutation.isLoading}
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
								isLoading={mutation.isLoading}
							>
								Sign Up
							</Button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
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

const SaclComponentWrapper = () => {
	const { saclStatus } = useContext(SaclContext);

	switch (saclStatus) {
		case "isSeededQuery.isLoading":
			return (
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<CheckingSeeded />
				</motion.div>
			);
			break;
		case "isSeededQuery.isError":
			return (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
				>
					<NetworkError />
				</motion.div>
			);
			break;
		case "isSignedInQuery.isLoading":
			return (
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<CheckingSignedIn />
				</motion.div>
			);
			break;
		case "isSignedInQuery.isError":
			return (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
				>
					<NetworkError />
				</motion.div>
			);
			break;
		default:
			return (
				<motion.div
					initial={{ opacity: 1, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
				>
					{null}
				</motion.div>
			);
			break;
	}
};

const Index = () => {
	const router = useRouter();
	const { saclStatus } = useContext(SaclContext);

	if (saclStatus === "isSeededQuery.notSeeded") {
		router.push("/seed");
	}

	if (saclStatus === "isSignedInQuery.isSuccess") {
		router.push("/home");
	}

	const isSignUpAvailableQuery = useQuery<any, AxiosError>({
		queryKey: "isSignUpAvailable",
		queryFn: getIsSignUpAvailable,
		retry: false,
		refetchOnWindowFocus: false,
	});

	return (
		<AnimatePresence mode="wait">
			{saclStatus === "isSignedInQuery.unauthorized" ? (
				isSignUpAvailableQuery.isLoading ? (
					<div>Loading...</div>
				) : isSignUpAvailableQuery.isError ? (
					<NetworkError />
				) : isSignUpAvailableQuery.data.isSignUpAvailable ? (
					<motion.div
						key={saclStatus}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<SignUp />
					</motion.div>
				) : (
					<motion.div
						key={"signUpNotAvailable"}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<SignUpNotAvailable />
					</motion.div>
				)
			) : (
				<SaclComponentWrapper key={saclStatus} />
			)}
		</AnimatePresence>
	);
};

export default Index;
