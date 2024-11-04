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
import { getMembers } from "@/utils/api/members";
import { Avatar } from "@/components/avatar/Avatar";
import { ContextMenu } from "@/components/contextMenu/ContextMenu";
import { DeleteMemberDialog } from "@/components/contextMenu/DeleteMemberDialog";
import { EditRolesDialog } from "@/components/contextMenu/EditRolesDialog";
import { FreezeMemberDialog } from "@/components/contextMenu/FreezeMemberDialog";
import { TransferOwnershipDialog } from "@/components/contextMenu/TransferOwnershipDialog";
import { UnfreezeMemberDialog } from "@/components/contextMenu/UnfreezeMemberDialog";
import {
	CrownIcon,
	SnowflakeIcon,
	MoreVerticalOutlineIcon,
	SearchOutlineIcon,
} from "@/components/icons/Icons";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { VerifyMemberDialog } from "@/components/contextMenu/VerifyMemberDialog";

const Divider = () => {
	return <div className="w-full h-[1px] my-2 bg-slate-200" />;
};

const Row = (props: {
	member: any;
	setActivePath: Dispatch<SetStateAction<string>>;
}) => {
	const { member, setActivePath } = props;
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
	const [showFreezeMemberDialog, setShowFreezeMemberDialog] =
		useState<boolean>(false);
	const [showUnfreezeMemberDialog, setShowUnfreezeMemberDialog] =
		useState<boolean>(false);
	const [showDeleteMemberDialog, setShowDeleteMemberDialog] =
		useState<boolean>(false);
	const [showVerifyMemberDialog, setShowVerifyMemberDialog] =
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
						member={member}
						className="w-10 h-10 rounded-full bg-sky-400"
					/>
					<div>
						<div
							className="flex justify-start items-center gap-4
							text-neutral-800 text-base font-semibold"
						>
							<div
								className={
									member.isFrozen ? "text-neutral-400" : ""
								}
							>
								{member.nickname}
							</div>
							{member.memberRoles.some(
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
							{member.isFrozen && (
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
							{!member.isVerified && (
								<div
									className="flex justify-start items-center px-2 py-[1px] gap-2
									text-sm font-semibold
									text-sky-50
									bg-neutral-400 rounded-md"
								>
									Unverified
								</div>
							)}
						</div>
						<div
							className={
								member.isFrozen
									? "text-slate-300 font-normal"
									: "text-slate-400 font-normal"
							}
						>
							{member.email}
						</div>
					</div>
				</div>
				{showMoreIcon && (
					<div
						ref={moreIconRef}
						className="text-neutral-400 hover:text-neutral-500 cursor-pointer"
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
							setShowDeleteMemberDialog={
								setShowDeleteMemberDialog
							}
							setShowFreezeMemberDialog={
								setShowFreezeMemberDialog
							}
							setShowUnfreezeMemberDialog={
								setShowUnfreezeMemberDialog
							}
							setShowVerifyMemberDialog={
								setShowVerifyMemberDialog
							}
							setShowTransferOwnershipDialog={
								setShowTransferOwnershipDialog
							}
							member={member}
						/>
					</div>
				)}
				{showEditRolesDialog && (
					<EditRolesDialog
						showEditRolesDialog={showEditRolesDialog}
						setShowEditRolesDialog={setShowEditRolesDialog}
						member={member}
					/>
				)}
				{showEditGroupsDialog && (
					<EditGroupsDialog
						showEditGroupsDialog={showEditGroupsDialog}
						setShowEditGroupsDialog={setShowEditGroupsDialog}
						member={member}
					/>
				)}
				{showDeleteMemberDialog && (
					<DeleteMemberDialog
						showDeleteMemberDialog={showDeleteMemberDialog}
						setShowDeleteMemberDialog={setShowDeleteMemberDialog}
						member={member}
					/>
				)}
				{showFreezeMemberDialog && (
					<FreezeMemberDialog
						showFreezeMemberDialog={showFreezeMemberDialog}
						setShowFreezeMemberDialog={setShowFreezeMemberDialog}
						member={member}
					/>
				)}
				{showUnfreezeMemberDialog && (
					<UnfreezeMemberDialog
						showUnfreezeMemberDialog={showUnfreezeMemberDialog}
						setShowUnfreezeMemberDialog={
							setShowUnfreezeMemberDialog
						}
						member={member}
					/>
				)}
				{showVerifyMemberDialog && (
					<VerifyMemberDialog
						showVerifyMemberDialog={showVerifyMemberDialog}
						setShowVerifyMemberDialog={setShowVerifyMemberDialog}
						member={member}
					/>
				)}
				{showTransferOwnershipDialog && (
					<TransferOwnershipDialog
						member={member}
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
	const { jwt } = useAuthStore();

	const [searchResults, setSearchResults] = useState<any[]>([]);

	const membersQuery = useQuery<any, AxiosError>({
		queryKey: ["getMembers", jwt],
		queryFn: async () => {
			const members = await getMembers(jwt);
			return members;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		setSearchResults(membersQuery.data);
	}, [membersQuery.data]);

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (membersQuery.data) {
			const results = membersQuery.data.filter((member: any) =>
				member.nickname
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
					{membersQuery.data &&
						(membersQuery.data.length === 0 ? (
							<div>0 Member</div>
						) : membersQuery.data.length === 1 ? (
							<div>1 Member</div>
						) : (
							<div>{membersQuery.data.length} Members</div>
						))}
				</div>
				<div className="flex gap-2 font-normal">
					<div className="flex">
						<input
							type="text"
							className="bg-neutral-200 px-2
							rounded-l placeholder-neutral-500 outline-none"
							placeholder="Search"
							onChange={onSearch}
						/>
						<div
							className="flex justify-center items-center w-6 
							bg-neutral-200 rounded-r"
						>
							<SearchOutlineIcon size={18} />
						</div>
					</div>
				</div>
			</div>
			{membersQuery.isLoading || !searchResults ? (
				<Skeleton />
			) : (
				<div>
					{searchResults.map((member: any) => {
						return (
							<Row
								key={member.id}
								member={member}
								setActivePath={setActivePath}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};
