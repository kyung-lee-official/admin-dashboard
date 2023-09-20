"use client";

import { Avatar } from "@/components/avatar";
import { CircleWithCrossIcon, SearchOutlineIcon } from "@/components/icons";
import { useEffect, useState } from "react";
import { AddMemberToRoleDialog } from "./AddMemberToRoleDialog";
import { DeleteMemberFromRoleDialog } from "./DeleteMemberFromRoleDialog";

const MemberRow = (props: {
	user: any;
	activeRole: any;
	activeRoleId: number;
}) => {
	const { user, activeRole, activeRoleId } = props;
	const [showDeleteMemberDialog, setShowDeleteMemberDialog] =
		useState<boolean>(false);

	return (
		<div
			key={user.id}
			className="flex justify-between items-center h-[40px] px-2 py-1
			hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
		>
			<div className="flex items-center gap-4">
				<Avatar
					user={user}
					className="w-6 h-6 rounded-full bg-sky-400"
				/>
				<div className="flex gap-2">
					<div className="text-sm">{user.nickname}</div>
					<div className="text-gray-500 text-sm font-normal">
						{user.email}
					</div>
				</div>
			</div>
			<div
				className="text-gray-400 hover:text-gray-500 cursor-pointer"
				onClick={() => {
					setShowDeleteMemberDialog(true);
				}}
			>
				<CircleWithCrossIcon size={20} />
			</div>
			{showDeleteMemberDialog && (
				<DeleteMemberFromRoleDialog
					activeRole={activeRole}
					activeRoleId={activeRoleId}
					user={user}
					showDeleteMemberDialog={showDeleteMemberDialog}
					setShowDeleteMemberDialog={setShowDeleteMemberDialog}
				/>
			)}
		</div>
	);
};

export const MembersPage = (props: any) => {
	const { rolesQuery, activeRoleId } = props;
	const [showAddMemberDialog, setShowAddMemberDialog] =
		useState<boolean>(false);
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const activeRole = rolesQuery.data?.find((role: any) => {
		return role.id === activeRoleId;
	});

	useEffect(() => {
		if (activeRole) {
			setSearchResults(activeRole.users);
		}
	}, [activeRole]);

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (activeRole) {
			const results = activeRole.users.filter((user: any) =>
				user.nickname
					.toLowerCase()
					.includes(e.target.value.toLowerCase())
			);
			setSearchResults(results);
		}
	};

	return (
		<div className="flex flex-col gap-4 py-2">
			<div className="flex justify-between items-center gap-4">
				<div className="flex-1 flex">
					<input
						className="w-full h-8 px-2
						text-gray-600 dark:text-gray-400
						font-medium
						bg-gray-200
						rounded-l outline-none
						placeholder-gray-500 dark:placeholder-gray-400"
						placeholder="Search Members"
						onChange={onSearch}
					/>
					<div
						className="flex justify-center items-center w-10
						bg-gray-200
						rounded-r"
					>
						<SearchOutlineIcon size={24} />
					</div>
				</div>
				<button
					className="w-28 h-8 bg-blue-500 rounded text-white font-semibold
					hover:bg-blue-600 transition-all duration-300"
					onClick={() => {
						setShowAddMemberDialog(true);
					}}
				>
					Add Members
				</button>
			</div>
			{showAddMemberDialog && (
				<AddMemberToRoleDialog
					activeRole={activeRole}
					showAddMemberDialog={showAddMemberDialog}
					setShowAddMemberDialog={setShowAddMemberDialog}
				/>
			)}
			{searchResults.map((user: any) => {
				return (
					<MemberRow
						key={user.id}
						user={user}
						activeRole={activeRole}
						activeRoleId={activeRoleId}
					/>
				);
			})}
		</div>
	);
};
