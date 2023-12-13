"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getMyInfo } from "@/utilities/api/users";
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
	user: any;
	setShowEditRolesDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowEditGroupsDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowDeleteUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowFreezeUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowUnfreezeUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowVerifyUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
	setShowTransferOwnershipDialog: React.Dispatch<
		React.SetStateAction<boolean>
	>;
}) => {
	const {
		user,
		setShowEditRolesDialog,
		setShowEditGroupsDialog,
		setShowDeleteUserDialog,
		setShowFreezeUserDialog,
		setShowUnfreezeUserDialog,
		setShowVerifyUserDialog,
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
			if (user.memberRoles.some((role: any) => role.name === "admin")) {
				setIsAdmin(true);
			}
			if (myInfoQuery.data.id === user.id) {
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
			{!user.isVerified && (
				<button
					className="w-full"
					onClick={() => {
						setShowVerifyUserDialog(true);
					}}
				>
					<Item type="warning">Verify {user.nickname}</Item>
				</button>
			)}
			{!isAdmin &&
				!isMe &&
				(user.isFrozen ? (
					<button
						className="w-full"
						onClick={() => {
							setShowUnfreezeUserDialog(true);
						}}
					>
						<Item type="danger">Unfreeze {user.nickname}</Item>
					</button>
				) : (
					<button
						className="w-full"
						onClick={() => {
							setShowFreezeUserDialog(true);
						}}
					>
						<Item type="danger">Freeze {user.nickname}</Item>
					</button>
				))}
			{!isAdmin && !isMe && (
				<button
					className="w-full"
					onClick={() => {
						setShowDeleteUserDialog(true);
					}}
				>
					<Item type="danger">Delete {user.nickname}</Item>
				</button>
			)}
			<hr className="w-full my-1 border-gray-300" />
			{!isAdmin && !isMe && !user.isFrozen && (
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
						navigator.clipboard.writeText(user.id);
					}}
				>
					<div>Copy User ID</div>
					<IdIcon size={20} />
				</div>
			</Item>
		</div>
	);
};
