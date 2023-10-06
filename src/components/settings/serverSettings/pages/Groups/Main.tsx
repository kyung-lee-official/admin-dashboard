"use client";

import { UserIcon, EditIcon, DeleteIcon } from "@/components/icons/Icons";
import { SettingsHeading } from "@/components/settings/ContentRegion";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { createGroup, deleteGroupById } from "@/utilities/api/groups";
import { queryClient } from "@/utilities/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { animate } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const Divider = () => {
	return <div className="w-full h-[1px] my-4 bg-slate-200" />;
};

const Row = (props: any) => {
	const { col1, col2, col3 } = props;
	return (
		<div>
			<div className="flex justify-between items-center gap-4">
				<div className="w-32">
					{col1 === "everyone" ? (
						<div
							className="flex justify-start items-center w-fit px-1
							text-gray-500 bg-gray-200 rounded-md"
						>
							everyone
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
	const { groupsQuery, setPage, setActiveGroupId, accessToken } = props;
	const [searchResult, setSearchResult] = useState([]);
	const [groupToDelete, setGroupToDelete] = useState<any>(null);
	const [showSeeMore, setShowSeeMore] = useState<boolean>(false);

	const deleteDialogRef = useRef<HTMLDialogElement>(null);

	const createGroupMutation = useMutation({
		mutationFn: async () => {
			return createGroup(accessToken);
		},
		onSuccess: async (group) => {
			await queryClient.invalidateQueries({
				queryKey: ["getGroups", accessToken],
			});
			setActiveGroupId(group.id);
			setPage("edit");
		},
	});

	const deleteGroupMutation = useMutation({
		mutationFn: async (groupId: number) => {
			return deleteGroupById(groupId, accessToken);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["getGroups", accessToken],
			});
			deleteDialogRef.current!.close();
		},
	});

	useEffect(() => {
		if (deleteDialogRef.current) {
			animate(deleteDialogRef.current, { opacity: 0, scale: 0.9 });
		}
	}, [deleteDialogRef.current]);

	useEffect(() => {
		if (groupsQuery.data) {
			setSearchResult(groupsQuery.data);
		}
	}, [groupsQuery.data]);

	const onSearch = (e: any) => {
		const { value } = e.target;
		if (value === "") {
			setSearchResult(groupsQuery.data);
		} else {
			if (groupsQuery.data) {
				const result = groupsQuery.data.filter((group: any) => {
					return group.name
						.toLowerCase()
						.includes(value.toLowerCase());
				});
				setSearchResult(result);
			}
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<SettingsHeading>Groups</SettingsHeading>
			<div className="font-normal">
				Groups are used to separate resources, users can only access
				resources under the groups they are in.
				{showSeeMore ? (
					<div>
						For example, Both Alice and Bob has role &quot;Product
						Manager&quot; but Alice is in group &quot;A&quot; and
						Bob is in group &quot;B&quot;, Alice can only access
						products under group &quot;A&quot; and Bob can only
						access products under group &quot;B&quot;.
					</div>
				) : (
					<div
						className="cursor-pointer"
						onClick={() => {
							setShowSeeMore(true);
						}}
					>
						<u>See more...</u>
					</div>
				)}
			</div>
			{groupsQuery.isLoading ? (
				<Skeleton />
			) : (
				<div>
					<div className="flex justify-between items-center gap-6 h-9 my-8">
						<input
							type="text"
							placeholder="Search Groups"
							className="flex-1 h-9 px-2
							bg-gray-200 rounded
							placeholder-gray-500 focus:outline-none"
							onChange={onSearch}
						/>
						<div
							className={
								createGroupMutation.isLoading
									? `flex-[0_0_8rem] flex justify-center items-center p-2
									text-gray-100 bg-blue-500 rounded cursor-wait`
									: `flex-[0_0_8rem] flex justify-center items-center p-2
									text-gray-100 bg-blue-500 hover:bg-blue-600 cursor-pointer
									rounded`
							}
							onClick={() => {
								createGroupMutation.mutate();
							}}
						>
							Create Group
						</div>
					</div>
					<Row
						col1={`Groups - ${groupsQuery.data.length}`}
						col2={`Members`}
						col3={""}
					/>
					{searchResult.map((group: any) => {
						return (
							<Row
								key={group.id}
								col1={group.name}
								col2={
									<div className="flex gap-2">
										{group.users.length}{" "}
										<UserIcon size={20} />
									</div>
								}
								col3={
									<div className="flex justify-center items-center gap-2">
										<button
											className="flex justify-center items-center w-8 h-8
											bg-gray-200 hover:bg-gray-300
											rounded-full"
											onClick={() => {
												setActiveGroupId(group.id);
												setPage("edit");
											}}
										>
											<EditIcon size={20} />
										</button>
										<button
											className={
												group.name === "everyone"
													? `flex justify-center items-center w-8 h-8
												text-gray-400
												bg-gray-200
												rounded-full cursor-not-allowed`
													: `flex justify-center items-center w-8 h-8
												hover:text-gray-200
												bg-gray-200 hover:bg-red-500
												rounded-full`
											}
											disabled={group.name === "everyone"}
											onClick={() => {
												setGroupToDelete(group);
												deleteDialogRef.current!.showModal();
												animate(
													deleteDialogRef.current!,
													{ opacity: 1, scale: 1 }
												);
											}}
										>
											<DeleteIcon size={20} />
										</button>
									</div>
								}
							/>
						);
					})}
					<dialog
						ref={deleteDialogRef}
						className="w-[440px]
						bg-gray-200
						shadow-lg rounded-md backdrop:bg-black/80 backdrop:[backdrop-filter:blur(2px)]"
					>
						<div
							className="flex flex-col justify-center items-center p-6 gap-8
							text-gray-600"
						>
							<h1 className="text-lg">Delete Group</h1>
							<p className="px-4 text-center font-normal">
								Are you sure you want to delete the{" "}
								<strong>{groupToDelete?.name}</strong> group?
								This action cannot be undone.
							</p>
							<div className="flex gap-6 p-2">
								<button
									className={
										deleteGroupMutation.isLoading
											? `flex justify-center items-center w-20 h-8
										text-gray-700/60
										bg-gray-300/60 rounded outline-none cursor-wait`
											: `flex justify-center items-center w-20 h-8
										text-gray-700
										bg-gray-300 hover:bg-gray-400 rounded outline-none`
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
										deleteGroupMutation.isLoading
											? `flex justify-center items-center w-20 h-8
										text-gray-100
										bg-red-500/60 rounded cursor-wait`
											: `flex justify-center items-center w-20 h-8
										text-gray-100
										bg-red-500 hover:bg-red-600 rounded`
									}
									onClick={() => {
										deleteGroupMutation.mutate(
											groupToDelete.id
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
