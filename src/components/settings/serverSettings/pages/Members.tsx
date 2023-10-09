"use client";

import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { SettingsHeading } from "../../ContentRegion";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { EditGroupsDialog } from "@/components/contextMenu/EditGroupsDialog";
import { getUsers } from "@/utilities/api/users";
import { Avatar } from "@/components/avatar/Avatar";
import { ContextMenu } from "@/components/contextMenu/ContextMenu";
import { DeleteUserDialog } from "@/components/contextMenu/DeleteUserDialog";
import { EditRolesDialog } from "@/components/contextMenu/EditRolesDialog";
import { FreezeUserDialog } from "@/components/contextMenu/FreezeUserDialog";
import { TransferOwnershipDialog } from "@/components/contextMenu/TransferOwnershipDialog";
import { UnfreezeUserDialog } from "@/components/contextMenu/UnfreezeUserDialog";
import {
	CrownIcon,
	SnowflakeIcon,
	MoreVerticalOutlineIcon,
	SearchOutlineIcon,
} from "@/components/icons/Icons";
import { Skeleton } from "@/components/skeleton/Skeleton";
import VerifyUserDialog from "@/components/contextMenu/VerifyUserDialog";

const Divider = () => {
	return <div className="w-full h-[1px] my-2 bg-slate-200" />;
};

const Row = (props: {
	user: any;
	setActivePath: Dispatch<SetStateAction<string>>;
}) => {
	const { user, setActivePath } = props;
	const [showMoreIcon, setShowMoreIcon] = useState<boolean>(false);
	const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
	const [contextMenuPos, setContextMenuPos] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });

	const [showEditRolesDialog, setShowEditRolesDialog] =
		useState<boolean>(false);
	const [showEditGroupsDialog, setShowEditGroupsDialog] =
		useState<boolean>(false);
	const [showFreezeUserDialog, setShowFreezeUserDialog] =
		useState<boolean>(false);
	const [showUnfreezeUserDialog, setShowUnfreezeUserDialog] =
		useState<boolean>(false);
	const [showDeleteUserDialog, setShowDeleteUserDialog] =
		useState<boolean>(false);
	const [showVerifyUserDialog, setShowVerifyUserDialog] =
		useState<boolean>(false);
	const [showTransferOwnershipDialog, setShowTransferOwnershipDialog] =
		useState<boolean>(false);

	const moreIconRef = useRef<any>(null);
	const contextMenuRef = useRef<any>(null);

	useEffect(() => {
		document.addEventListener("click", (e) => {
			setContextMenuPos({
				x: e.clientX,
				y: e.clientY,
			});
			if (moreIconRef.current && e.target instanceof Node) {
				if (moreIconRef.current.contains(e.target)) {
					setShowContextMenu(true);
				} else {
					setShowContextMenu(false);
				}
			} else {
				setShowContextMenu(false);
			}
		});
		return () => {
			document.removeEventListener("click", () => {});
		};
	}, []);

	return (
		<div
			onMouseEnter={() => {
				setShowMoreIcon(true);
			}}
			onMouseLeave={() => {
				setShowMoreIcon(false);
			}}
		>
			<div className="flex justify-between items-center p-2 gap-2">
				<div className="flex items-center gap-4">
					<Avatar
						user={user}
						className="w-10 h-10 rounded-full bg-sky-400"
					/>
					<div>
						<div
							className="flex justify-start items-center gap-4
							text-gray-800 text-base font-mono font-semibold"
						>
							<div
								className={user.isFrozen ? "text-gray-400" : ""}
							>
								{user.nickname}
							</div>
							{user.roles.some(
								(role: any) => role.name === "admin"
							) && (
								<div
									className="flex justify-start items-center px-2 py-[1px] gap-2
									text-sm font-semibold
									text-yellow-400
									bg-zinc-900 rounded-md"
								>
									<CrownIcon size={16} />
									admin
								</div>
							)}
							{user.isFrozen && (
								<div
									className="flex justify-start items-center px-2 py-[1px] gap-2
									text-sm font-semibold
									text-sky-50
									bg-sky-300 rounded-md"
								>
									<SnowflakeIcon size={16} />
									Frozen
								</div>
							)}
							{!user.isVerified && (
								<div
									className="flex justify-start items-center px-2 py-[1px] gap-2
									text-sm font-semibold
									text-sky-50
									bg-gray-400 rounded-md"
								>
									Unverified
								</div>
							)}
						</div>
						<div
							className={
								user.isFrozen
									? "text-slate-300 font-normal"
									: "text-slate-400 font-normal"
							}
						>
							{user.email}
						</div>
					</div>
				</div>
				{showMoreIcon && (
					<div
						ref={moreIconRef}
						className="text-gray-400 hover:text-gray-500 cursor-pointer"
					>
						<MoreVerticalOutlineIcon size={24} />
					</div>
				)}
				{showContextMenu && (
					<div
						ref={contextMenuRef}
						className="fixed"
						style={{
							left: contextMenuPos.x,
							top: contextMenuPos.y,
						}}
					>
						<ContextMenu
							setShowEditRolesDialog={setShowEditRolesDialog}
							setShowEditGroupsDialog={setShowEditGroupsDialog}
							setShowDeleteUserDialog={setShowDeleteUserDialog}
							setShowFreezeUserDialog={setShowFreezeUserDialog}
							setShowUnfreezeUserDialog={
								setShowUnfreezeUserDialog
							}
							setShowVerifyUserDialog={setShowVerifyUserDialog}
							setShowTransferOwnershipDialog={
								setShowTransferOwnershipDialog
							}
							user={user}
						/>
					</div>
				)}
				{showEditRolesDialog && (
					<EditRolesDialog
						showEditRolesDialog={showEditRolesDialog}
						setShowEditRolesDialog={setShowEditRolesDialog}
						user={user}
					/>
				)}
				{showEditGroupsDialog && (
					<EditGroupsDialog
						showEditGroupsDialog={showEditGroupsDialog}
						setShowEditGroupsDialog={setShowEditGroupsDialog}
						user={user}
					/>
				)}
				{showDeleteUserDialog && (
					<DeleteUserDialog
						showDeleteUserDialog={showDeleteUserDialog}
						setShowDeleteUserDialog={setShowDeleteUserDialog}
						user={user}
					/>
				)}
				{showFreezeUserDialog && (
					<FreezeUserDialog
						showFreezeUserDialog={showFreezeUserDialog}
						setShowFreezeUserDialog={setShowFreezeUserDialog}
						user={user}
					/>
				)}
				{showUnfreezeUserDialog && (
					<UnfreezeUserDialog
						showUnfreezeUserDialog={showUnfreezeUserDialog}
						setShowUnfreezeUserDialog={setShowUnfreezeUserDialog}
						user={user}
					/>
				)}
				{showVerifyUserDialog && (
					<VerifyUserDialog
						showVerifyUserDialog={showVerifyUserDialog}
						setShowVerifyUserDialog={setShowVerifyUserDialog}
						user={user}
					/>
				)}
				{showTransferOwnershipDialog && (
					<TransferOwnershipDialog
						user={user}
						showTransferOwnershipDialog={
							showTransferOwnershipDialog
						}
						setShowTransferOwnershipDialog={
							setShowTransferOwnershipDialog
						}
						setActivePath={setActivePath}
					/>
				)}
			</div>
			<Divider />
		</div>
	);
};

export const Members = (props: any) => {
	const { setActivePath } = props;
	const { accessToken } = useAuthStore();

	const [searchResults, setSearchResults] = useState<any[]>([]);

	const usersQuery = useQuery<any, AxiosError>({
		queryKey: ["getUsers", accessToken],
		queryFn: async () => {
			const users = await getUsers(accessToken);
			return users;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		setSearchResults(usersQuery.data);
	}, [usersQuery.data]);

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (usersQuery.data) {
			const results = usersQuery.data.filter((user: any) =>
				user.nickname
					.toLowerCase()
					.includes(e.target.value.toLowerCase())
			);
			setSearchResults(results);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<SettingsHeading>Members</SettingsHeading>
			<div className="flex justify-between items-center">
				<div className="font-normal">
					{usersQuery.data &&
						(usersQuery.data.length === 0 ? (
							<div>0 Member</div>
						) : usersQuery.data.length === 1 ? (
							<div>1 Member</div>
						) : (
							<div>{usersQuery.data.length} Members</div>
						))}
				</div>
				<div className="flex gap-2 font-normal">
					<div className="flex">
						<input
							type="text"
							className="bg-gray-200 px-2
							rounded-l placeholder-gray-500 outline-none"
							placeholder="Search"
							onChange={onSearch}
						/>
						<div
							className="flex justify-center items-center w-6 
							bg-gray-200 rounded-r"
						>
							<SearchOutlineIcon size={18} />
						</div>
					</div>
				</div>
			</div>
			{usersQuery.isLoading || !searchResults ? (
				<Skeleton />
			) : (
				<div>
					{searchResults.map((user: any) => {
						return (
							<Row
								key={user.id}
								user={user}
								setActivePath={setActivePath}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
