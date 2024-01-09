"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getMyInfo } from "@/utils/api/members";
import { useAuthStore } from "@/stores/auth";
import { IdIcon } from "../icons/Icons";

const Item = (props: {
	children: any;
	type: "normal" | "warning" | "danger";
}) => {
	const { children, type } = props;
	if (type === "warning") {
		return (
			<div
				className="flex justify-start items-center w-full px-2 py-1 gap-4
				text-base font-mono
				text-yellow-500 hover:text-yellow-50
				hover:bg-yellow-500
				rounded cursor-pointer"
			>
				{children}
			</div>
		);
	}
	if (type === "danger") {
		return (
			<div
				className="flex justify-start items-center w-full px-2 py-1 gap-4
				text-base font-mono
				text-red-500 hover:text-red-50
				hover:bg-red-600
				rounded cursor-pointer"
			>
				{children}
			</div>
		);
	}
	return (
		<div
			className="flex justify-start items-center w-full px-2 py-1 gap-4
			text-base font-mono
			text-gray-500 hover:text-gray-200
			hover:bg-gray-500
			rounded cursor-pointer"
		>
			{children}
		</div>
	);
};

export const ContextMenu = (props: {
	member: any;
	setShowEditRolesDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowEditGroupsDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowDeleteMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowFreezeMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowUnfreezeMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowVerifyMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowTransferOwnershipDialog: React.Dispatch<
		React.SetStateAction<boolean>
	>;
}) => {
	const {
		member,
		setShowEditRolesDialog,
		setShowEditGroupsDialog,
		setShowDeleteMemberDialog,
		setShowFreezeMemberDialog,
		setShowUnfreezeMemberDialog,
		setShowVerifyMemberDialog,
		setShowTransferOwnershipDialog,
	} = props;

	const accessToken = useAuthStore((state) => state.accessToken);

	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [isMe, setIsMe] = useState<boolean>(false);

	const myInfoQuery = useQuery<any, AxiosError>({
		queryKey: ["myInfo", accessToken],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(accessToken);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (myInfoQuery.data) {
			if (member.memberRoles.some((role: any) => role.name === "admin")) {
				setIsAdmin(true);
			}
			if (myInfoQuery.data.id === member.id) {
				setIsMe(true);
			}
		}
	}, [myInfoQuery.data]);

	return (
		<div
			className="flex flex-col justify-center items-center w-fit min-h-[32px] p-2
			font-normal
			bg-gray-100 rounded-md shadow-md overflow-hidden"
		>
			<button
				className="w-full"
				onClick={() => {
					setShowEditRolesDialog(true);
				}}
			>
				<Item type="normal">Edit Roles</Item>
			</button>
			<button
				className="w-full"
				onClick={() => {
					setShowEditGroupsDialog(true);
				}}
			>
				<Item type="normal">Edit Groups</Item>
			</button>
			{!member.isVerified && (
				<button
					className="w-full"
					onClick={() => {
						setShowVerifyMemberDialog(true);
					}}
				>
					<Item type="warning">Verify {member.nickname}</Item>
				</button>
			)}
			{!isAdmin &&
				!isMe &&
				(member.isFrozen ? (
					<button
						className="w-full"
						onClick={() => {
							setShowUnfreezeMemberDialog(true);
						}}
					>
						<Item type="danger">Unfreeze {member.nickname}</Item>
					</button>
				) : (
					<button
						className="w-full"
						onClick={() => {
							setShowFreezeMemberDialog(true);
						}}
					>
						<Item type="danger">Freeze {member.nickname}</Item>
					</button>
				))}
			{!isAdmin && !isMe && (
				<button
					className="w-full"
					onClick={() => {
						setShowDeleteMemberDialog(true);
					}}
				>
					<Item type="danger">Delete {member.nickname}</Item>
				</button>
			)}
			<hr className="w-full my-1 border-gray-300" />
			{!isAdmin && !isMe && !member.isFrozen && (
				<div className="w-full">
					<button
						className="w-full"
						onClick={() => {
							setShowTransferOwnershipDialog(true);
						}}
					>
						<Item type="danger">Transfer Ownership</Item>
					</button>
					<hr className="w-full my-1 border-gray-300" />
				</div>
			)}
			<Item type="normal">
				<div
					className="flex justify-between items-center w-full gap-2"
					onClick={() => {
						navigator.clipboard.writeText(member.id);
					}}
				>
					<div>Copy Member ID</div>
					<IdIcon size={20} />
				</div>
			</Item>
		</div>
	);
};
