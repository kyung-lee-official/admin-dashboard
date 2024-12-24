import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { z } from "zod";
import { changePassword } from "@/utils/api/authentication";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { DevTool } from "@hookform/devtools";
import { AxiosError } from "axios";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";

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
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.CHANGE_PASSWORD;
	const title = "Change Password";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const [oldData, setOldData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	});
	const [newData, setNewData] = useState(oldData);
	const [currPassword, setCurrPassword] = useState(oldData.currentPassword);
	const [newPassword, setNewPassword] = useState(oldData.newPassword);
	const [confirmNewPassword, setConfirmNewPassword] = useState(
		oldData.confirmNewPassword
	);

	useEffect(() => {
		setNewData({
			currentPassword: currPassword,
			newPassword: newPassword,
			confirmNewPassword: confirmNewPassword,
		});
	}, [currPassword, newPassword, confirmNewPassword]);

	const mutation = useMutation<any, AxiosError>({
		mutationFn: () => {
			return changePassword(
				{
					oldPassword: newData.currentPassword,
					newPassword: newData.newPassword,
				},
				jwt
			);
		},
		onSuccess: (data) => {
			setEdit({ show: false, id: editId });
		},
	});

	function onSave() {
		mutation.mutate();
	}

	const { register, handleSubmit, formState, control } = useForm<IFormInput>({
		mode: "onChange",
		resolver: zodResolver(schema),
	});

	return (
		<EditContentRegular
			title={title}
			editId={editId}
			edit={edit}
			setEdit={setEdit}
			onSave={onSave}
			newData={newData}
			oldData={oldData}
		>
			<form onSubmit={handleSubmit(onSave)} className="flex flex-col">
				<div className="flex flex-col px-6 py-4 gap-6">
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
									setCurrPassword(e.target.value);
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
									setNewPassword(e.target.value);
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
									setConfirmNewPassword(e.target.value);
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
			</form>
			{/* set up the dev tool */}
			{/* <DevTool control={control} /> */}
		</EditContentRegular>
	);
};
