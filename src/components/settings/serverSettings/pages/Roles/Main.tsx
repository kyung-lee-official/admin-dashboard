"use client";

import { CrownIcon, DeleteIcon, EditIcon, UserIcon } from "@/components/icons";
import { SettingsHeading } from "@/components/settings/ContentRegion";
import { Skeleton } from "@/components/skeleton";
import { createRole, deleteRoleById } from "@/utilities/api/api";
import { queryClient } from "@/utilities/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Divider = () => {
	return <div className="w-full h-[1px] my-4 bg-slate-200" />;
};

const Row = (props: any) => {
	const { col1, col2, col3 } = props;
	return (
		<div>
			<div className="flex justify-between items-center gap-4">
				<div className="min-w-[5rem]">
					{col1 === "admin" ? (
						<div
							className="flex justify-start items-center w-fit gap-1 px-1
							text-yellow-400
							bg-zinc-900 rounded-md"
						>
							{<CrownIcon size={16} />} admin
						</div>
					) : col1 === "common" ? (
						<div
							className="flex justify-start items-center w-fit px-1
							text-gray-500 bg-gray-300 rounded-md"
						>
							common
						</div>
					) : (
						<div>{col1}</div>
					)}
				</div>
				<div className="min-w-[5rem]">{col2}</div>
				<div className="min-w-[5rem]">{col3}</div>
			</div>
			<Divider />
		</div>
	);
};

export const Main = (props: any) => {
	const { rolesQuery, setPage, setActiveRoleId, accessToken } = props;
	const [searchResult, setSearchResult] = useState([]);
	const [roleToDelete, setRoleToDelete] = useState<any>(null);

	const deleteDialogRef = useRef<HTMLDialogElement>(null);

	const createRoleMutation = useMutation({
		mutationFn: async () => {
			return createRole(accessToken);
		},
		onSuccess: async (role) => {
			await queryClient.invalidateQueries({
				queryKey: ["getRoles", accessToken],
			});
			setActiveRoleId(role.id);
			setPage("edit");
		},
	});

	const deleteRoleMutation = useMutation({
		mutationFn: async (roleId: number) => {
			return deleteRoleById(roleId, accessToken);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getRoles", accessToken],
			});
			deleteDialogRef.current!.close();
		},
	});

	const [scope, animate] = useAnimate();

	useEffect(() => {
		if (deleteDialogRef.current) {
			animate(deleteDialogRef.current, { opacity: 0, scale: 0.9 });
		}
	}, [deleteDialogRef.current]);

	useEffect(() => {
		if (rolesQuery.data) {
			setSearchResult(rolesQuery.data);
		}
	}, [rolesQuery.data]);

	const onSearch = (e: any) => {
		const { value } = e.target;
		if (value === "") {
			setSearchResult(rolesQuery.data);
		} else {
			if (rolesQuery.data) {
				const result = rolesQuery.data.filter((role: any) => {
					return role.name
						.toLowerCase()
						.includes(value.toLowerCase());
				});
				setSearchResult(result);
			}
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<SettingsHeading>Roles</SettingsHeading>
			<div className="font-normal">
				Each role can have different permissions. A permission
				determines what a member can do.
			</div>
			{rolesQuery.isLoading ? (
				<Skeleton />
			) : (
				<div>
					<div className="flex justify-between items-center gap-6 h-9 my-8">
						<input
							type="text"
							placeholder="Search Roles"
							className="flex-1 h-9 px-2
							bg-gray-200 rounded
							placeholder-gray-500 focus:outline-none"
							onChange={onSearch}
						/>
						<div
							className={
								createRoleMutation.isLoading
									? `flex-[0_0_8rem] flex justify-center items-center p-2
									text-gray-100 bg-blue-500 rounded cursor-wait`
									: `flex-[0_0_8rem] flex justify-center items-center p-2
									text-gray-100 bg-blue-500 hover:bg-blue-600 cursor-pointer
									rounded`
							}
							onClick={() => {
								createRoleMutation.mutate();
							}}
						>
							Create Role
						</div>
					</div>
					<Row
						col1={`Roles - ${rolesQuery.data.length}`}
						col2={"Members"}
						col3={""}
					/>
					{searchResult.map((role: any) => {
						return (
							<Row
								key={role.id}
								col1={role.name}
								col2={
									<div className="flex gap-2">
										{role.users.length}{" "}
										<UserIcon size={20} />
									</div>
								}
								col3={
									<div className="flex justify-center items-center gap-2">
										<div
											className="flex justify-center items-center w-8 h-8
											bg-gray-300 hover:bg-gray-400
											rounded-full cursor-pointer"
											onClick={() => {
												setActiveRoleId(role.id);
												setPage("edit");
											}}
										>
											<EditIcon size={20} />
										</div>
										<div
											className="flex justify-center items-center w-8 h-8
											hover:text-gray-200
											bg-gray-300 hover:bg-red-500
											rounded-full cursor-pointer"
											onClick={() => {
												setRoleToDelete(role);
												deleteDialogRef.current!.showModal();
												animate(
													deleteDialogRef.current!,
													{ opacity: 1, scale: 1 }
												);
											}}
										>
											<DeleteIcon size={20} />
										</div>
									</div>
								}
							/>
						);
					})}
					<dialog
						ref={deleteDialogRef}
						className="w-[440px]
						bg-gray-400
						shadow-lg rounded-md backdrop:bg-black/70 backdrop:[backdrop-filter:blur(2px)]"
					>
						<div
							className="flex flex-col justify-center items-center gap-8
							text-gray-600"
						>
							<h1 className="text-lg">DELETE ROLE</h1>
							<p className="px-4 text-cente font-normal">
								Are you sure you want to delete the{" "}
								<strong>{roleToDelete?.name}</strong> role? This
								action cannot be undone.
							</p>
							<div className="flex gap-6 p-2">
								<button
									className={
										deleteRoleMutation.isLoading
											? `flex justify-center items-center w-20 h-8
											text-gray-600
											bg-gray-400 hover:bg-gray-300 rounded outline-none cursor-wait`
											: `flex justify-center items-center w-20 h-8
											text-gray-600
											bg-gray-200 hover:bg-gray-300 rounded outline-none`
									}
									onClick={() => {
										deleteDialogRef.current!.close();
										animate(deleteDialogRef.current!, {
											opacity: 0,
											scale: 0.9,
										});
									}}
								>
									Cancel
								</button>
								<button
									className={
										deleteRoleMutation.isLoading
											? `flex justify-center items-center w-20 h-8
											text-gray-100
											bg-red-500/50 rounded cursor-wait`
											: `flex justify-center items-center w-20 h-8
											text-gray-100
											bg-red-500 hover:bg-red-600 rounded`
									}
									onClick={() => {
										deleteRoleMutation.mutate(
											roleToDelete.id
										);
									}}
								>
									Okay
								</button>
							</div>
						</div>
					</dialog>
				</div>
			)}
		</div>
	);
};
