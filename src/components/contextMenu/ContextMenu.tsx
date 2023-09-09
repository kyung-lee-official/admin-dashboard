import React from "react";
import { IdIcon } from "@/components/icons";

const Item = (props: { children: any; type: "normal" | "danger" }) => {
	const { children, type } = props;
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
		setShowTransferOwnershipDialog,
	} = props;

	return (
		<div
			className="flex flex-col justify-center items-center w-fit min-h-[32px] p-2
			font-normal
			bg-gray-100 rounded-md shadow-md overflow-hidden"
		>
			<div
				className="w-full"
				onClick={() => {
					setShowEditRolesDialog(true);
				}}
			>
				<Item type="normal">Edit Roles</Item>
			</div>
			<div
				className="w-full"
				onClick={() => {
					setShowEditGroupsDialog(true);
				}}
			>
				<Item type="normal">Edit Groups</Item>
			</div>
			<div
				className="w-full"
				onClick={() => {
					setShowFreezeUserDialog(true);
				}}
			>
				<Item type="danger">Freeze {user.nickname}</Item>
			</div>
			<div
				className="w-full"
				onClick={() => {
					setShowDeleteUserDialog(true);
				}}
			>
				<Item type="danger">Delete {user.nickname}</Item>
			</div>
			<hr className="w-full my-1 border-gray-300" />
			<div
				className="w-full"
				onClick={() => {
					setShowTransferOwnershipDialog(true);
				}}
			>
				<Item type="danger">Transfer Ownership</Item>
			</div>
			<hr className="w-full my-1 border-gray-300" />
			<Item type="normal">
				<div
					className="flex justify-between items-center w-full"
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
