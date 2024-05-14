"use client";

import { useEffect, useState } from "react";
import { AddMemberToRoleDialog } from "./AddMemberToRoleDialog";
import { DeleteMemberFromRoleDialog } from "./DeleteMemberFromRoleDialog";
import { Avatar } from "@/components/avatar/Avatar";
import {
	CircleWithCrossIcon,
	SearchOutlineIcon,
} from "@/components/icons/Icons";

const MemberRow = (props: {
	member: any;
	activeRole: any;
	activeRoleId: number;
}) => {
	const { member, activeRole, activeRoleId } = props;
	const [showDeleteMemberDialog, setShowDeleteMemberDialog] =
		useState<boolean>(false);

	return (
		<div
			key={member.id}
			className="flex justify-between items-center h-[40px] px-2 py-1
			hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
		>
			<div className="flex items-center gap-4">
				<Avatar
					member={member}
					className="w-6 h-6 rounded-full bg-sky-400"
				/>
				<div className="flex gap-2">
					<div className="text-sm">{member.nickname}</div>
					<div className="text-neutral-500 text-sm font-normal">
						{member.email}
					</div>
				</div>
			</div>
			<button
				className={
					activeRole.name === "admin"
						? `text-neutral-200 cursor-not-allowed`
						: `text-neutral-400 hover:text-neutral-500 cursor-pointer`
				}
				disabled={activeRole.name === "admin"}
				onClick={() => {
					setShowDeleteMemberDialog(true);
				}}
			>
				<CircleWithCrossIcon size={20} />
			</button>
			{showDeleteMemberDialog && (
				<DeleteMemberFromRoleDialog
					activeRole={activeRole}
					activeRoleId={activeRoleId}
					member={member}
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
			setSearchResults(activeRole.members);
		}
	}, [activeRole]);

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (activeRole) {
			const results = activeRole.members.filter((member: any) =>
				member.nickname
					.toLowerCase()
					.includes(e.target.value.toLowerCase())
			);
			setSearchResults(results);
		}
	};

	return (
		<div className="flex flex-col gap-4 py-2">
			{activeRole?.name !== "admin" && (
				<div className="flex justify-between items-center gap-4">
					<div className="flex-1 flex">
						<input
							className="w-full h-8 px-2
						text-neutral-600 dark:text-neutral-400
						font-medium
						bg-neutral-200
						rounded-l outline-none
						placeholder-neutral-500 dark:placeholder-neutral-400"
							placeholder="Search Members"
							onChange={onSearch}
						/>
						<div
							className="flex justify-center items-center w-10
						bg-neutral-200
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
			)}
			{showAddMemberDialog && (
				<AddMemberToRoleDialog
					activeRole={activeRole}
					showAddMemberDialog={showAddMemberDialog}
					setShowAddMemberDialog={setShowAddMemberDialog}
				/>
			)}
			{searchResults.map((member: any) => {
				return (
					<MemberRow
						key={member.id}
						member={member}
						activeRole={activeRole}
						activeRoleId={activeRoleId}
					/>
				);
			})}
		</div>
	);
};
