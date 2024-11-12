import { CloseIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button/Button";
import { motion } from "framer-motion";
import { UnsavedDialog } from "../../UnsavedDialog";
import { EditProps } from "../../EditPanel";
import { z } from "zod";
import { changePassword } from "@/utils/api/authentication";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import { AxiosError } from "axios";

interface IFormInput {
	oldPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

const schema = z
	.object({
		oldPassword: z.string().min(1, { message: "Required" }),
		newPassword: z
			.string()
			.min(8, { message: "Must be at least 8 characters" })
			.regex(
				/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
				"Password is too weak, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character"
			),
		confirmNewPassword: z.string().min(1, { message: "Required" }),
	})
	.refine((data) => data.oldPassword !== data.newPassword, {
		message: "New password must be different from old password",
		/* path of error */
		path: ["newPassword"],
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords don't match",
		/* path of error */
		path: ["confirmNewPassword"],
	});

export const EditContentPassword = (props: {
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = "change-password";
	const { setEdit } = props;

	const panelRef = useRef<HTMLDivElement>(null);

	const unsavedDialogRef = useRef<HTMLDialogElement>(null);

	const jwt = useAuthStore((state) => state.jwt);
	const [newData, setNewData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	});
	const [isChanged, setIsChanged] = useState(false);

	const mutation = useMutation<any, AxiosError, IFormInput>({
		mutationFn: (data: IFormInput) => {
			return changePassword(
				{
					oldPassword: data.oldPassword,
					newPassword: data.newPassword,
				},
				jwt
			);
		},
		onSuccess: (data) => {
			setIsChanged(false);
			setEdit({ show: false, id: editId });
		},
	});

	function onSave(data: IFormInput) {
		mutation.mutate(data);
	}

	useEffect(() => {
		if (
			newData &&
			JSON.stringify(newData) !==
				JSON.stringify({
					currentPassword: "",
					newPassword: "",
					confirmNewPassword: "",
				})
		) {
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
	}, [newData]);

	function quit() {
		if (isChanged) {
			if (unsavedDialogRef.current) {
				unsavedDialogRef.current.showModal();
			}
		} else {
			setEdit({ show: false, id: editId });
		}
	}

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (!panelRef.current) {
				return;
			}
			if (!panelRef.current.contains(event.target)) {
				quit();
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [panelRef, isChanged]);

	const { register, handleSubmit, formState, control } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	return (
		<motion.div
			ref={panelRef}
			initial={{ x: "100%" }}
			animate={{ x: "0%" }}
			transition={{ duration: 0.1 }}
			className="flex flex-col h-[calc(100svh-16px)] w-full max-w-[560px] m-2
			text-white/90
			bg-neutral-900
			rounded-lg border-[1px] border-neutral-700 border-t-neutral-600"
		>
			<div
				className="flex-[0_0_61px] flex justify-between px-6 py-4
				font-semibold text-lg
				border-b-[1px] border-white/10"
			>
				<div>Change Password</div>
				<button
					className="flex justify-center items-center w-7 h-7
					text-white/50
					hover:bg-white/10 rounded-md"
					onClick={() => {
						quit();
					}}
				>
					<CloseIcon size={15} />
				</button>
			</div>
			<form
				onSubmit={handleSubmit(onSave)}
				className="flex-[1_0_100px] flex flex-col"
			>
				<div
					className="flex-[1_0_100px] flex flex-col px-6 py-4 gap-6
					border-b-[1px] border-white/10"
				>
					<div
						className="flex flex-col gap-1.5
						text-sm"
					>
						Current Password
						<input
							type="password"
							className="px-2 py-1.5
							bg-white/10
							rounded-md outline-none
							border-[1px] border-white/10"
							{...register("oldPassword", {
								onChange: (e) => {
									mutation.reset();
									setNewData({
										...newData,
										currentPassword: e.target.value,
									});
								},
							})}
						/>
						{mutation.error &&
							mutation.error.response?.status === 401 && (
								<div className="text-base text-red-400 font-semibold">
									Password is incorrect
								</div>
							)}
					</div>
					<div
						className="flex flex-col gap-1.5
						text-sm"
					>
						New Password
						<input
							type="password"
							className="px-2 py-1.5
							bg-white/10
							rounded-md outline-none
							border-[1px] border-white/10"
							{...register("newPassword", {
								onChange: (e) => {
									setNewData({
										...newData,
										newPassword: e.target.value,
									});
								},
							})}
						/>
						{formState.errors.newPassword && (
							<div className="text-red-500/90">
								{formState.errors.newPassword.message}
							</div>
						)}
					</div>
					<div
						className="flex flex-col gap-1.5
						text-sm"
					>
						Enter New Password Again
						<input
							type="password"
							className="px-2 py-1.5
							bg-white/10
							rounded-md outline-none
							border-[1px] border-white/10"
							{...register("confirmNewPassword", {
								onChange: (e) => {
									setNewData({
										...newData,
										confirmNewPassword: e.target.value,
									});
								},
							})}
						/>
						{formState.errors.confirmNewPassword && (
							<div className="text-red-500/90">
								{formState.errors.confirmNewPassword.message}
							</div>
						)}
					</div>
				</div>
				<div className="flex-[0_0_61px] flex justify-end px-6 py-4 gap-1.5">
					<Button
						color="cancel"
						size="sm"
						onClick={() => {
							quit();
						}}
					>
						Cancel
					</Button>
					<Button type="submit" size="sm">
						Save
					</Button>
				</div>
			</form>
			{/* set up the dev tool */}
			<DevTool control={control} />
			<UnsavedDialog ref={unsavedDialogRef} setEdit={setEdit} />
		</motion.div>
	);
};
