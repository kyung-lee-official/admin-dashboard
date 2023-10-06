"use client";

import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utilities/react-query/react-query";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editUserRoles } from "@/utilities/api/users";
import { getRoles } from "@/utilities/api/roles";
import { SearchOutlineIcon } from "../icons/Icons";
import { CheckboxList } from "../input/CheckboxList";

export const EditRolesDialog = (props: {
	user: any;
	showEditRolesDialog: boolean;
	setShowEditRolesDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { user, showEditRolesDialog, setShowEditRolesDialog } = props;
	const accessToken = useAuthStore((state) => state.accessToken);

	const rolesQuery = useQuery<any, AxiosError>({
		queryKey: ["getRoles", accessToken],
		queryFn: async () => {
			const roles = await getRoles(accessToken);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [newUserRoles, setNewUserRoles] = useState(user.roles);
	const [disabledRoleIds, setDisabledRoleIds] = useState<number[]>([]);
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const showRolesDialogRef = useRef<HTMLDialogElement | null>(null);

	const editRolesMutation = useMutation({
		mutationFn: async ({
			userId,
			roleIds,
		}: {
			userId: string;
			roleIds: number[];
		}) => {
			return editUserRoles(userId, roleIds, accessToken);
		},
		onSuccess: (data) => {
			setShowEditRolesDialog(false);
			queryClient.invalidateQueries({
				queryKey: ["getUsers", accessToken],
			});
		},
	});

	useEffect(() => {
		if (showEditRolesDialog) {
			showRolesDialogRef.current!.showModal();
		}
	}, []);

	useEffect(() => {
		if (showEditRolesDialog) {
			showRolesDialogRef.current!.showModal();
		} else {
			showRolesDialogRef.current!.close();
		}
	}, [showEditRolesDialog]);

	useEffect(() => {
		setSearchResults(rolesQuery.data);
		if (rolesQuery.data) {
			const disabledRoleIds = rolesQuery.data
				.filter((role: any) => role.name === "admin")
				.map((role: any) => role.id);
			setDisabledRoleIds(disabledRoleIds);
		}
	}, [rolesQuery.data]);

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (rolesQuery.data) {
			const results = rolesQuery.data.filter((role: any) =>
				role.name.toLowerCase().includes(e.target.value.toLowerCase())
			);
			setSearchResults(results);
		}
	};

	return (
		<motion.dialog
			ref={showRolesDialogRef}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-[440px]
			bg-gray-200
			shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
			onCancel={(e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
				e.preventDefault();
				setShowEditRolesDialog(false);
			}}
		>
			<div
				className="flex flex-col justify-center items-center p-6 gap-6
				text-gray-600"
			>
				<h1 className="text-lg">Edit Roles</h1>
				<div className="font-normal">
					You&apos;re editing the roles of{" "}
					<strong>{user.nickname}</strong> ({user.email})
				</div>
				<div className="flex w-full font-normal">
					<input
						type="text"
						className="w-full h-10 px-4
						bg-gray-100
						rounded-l placeholder-gray-500 outline-none"
						placeholder="Search roles"
						onChange={onSearch}
					/>
					<div
						className="flex justify-center items-center w-12
						bg-gray-100 rounded-r"
					>
						<SearchOutlineIcon size={28} />
					</div>
				</div>
				<CheckboxList
					allOptions={searchResults}
					newSelectedOptions={newUserRoles}
					setNewSelectedOptions={setNewUserRoles}
					itemKey="name"
					disabledOptionIds={disabledRoleIds}
				/>
				<div className="flex gap-6">
					<button
						className={
							editRolesMutation.isLoading
								? `flex justify-center items-center w-20 h-8
							text-gray-700/60
							bg-gray-300/60 rounded outline-none cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-gray-700
							bg-gray-300 hover:bg-gray-400 rounded outline-none`
						}
						onClick={() => {
							setShowEditRolesDialog(false);
						}}
					>
						Cancel
					</button>
					<button
						className={
							editRolesMutation.isLoading
								? `flex justify-center items-center w-20 h-8
							text-gray-100
							bg-blue-500/60 rounded cursor-wait`
								: `flex justify-center items-center w-20 h-8
							text-gray-100
							bg-blue-500 hover:bg-blue-600 rounded`
						}
						onClick={() => {
							const newUserRoleIds = newUserRoles.map(
								(role: any) => role.id
							);
							editRolesMutation.mutate({
								userId: user.id,
								roleIds: newUserRoleIds,
							});
						}}
					>
						Apply
					</button>
				</div>
			</div>
		</motion.dialog>
	);
};
