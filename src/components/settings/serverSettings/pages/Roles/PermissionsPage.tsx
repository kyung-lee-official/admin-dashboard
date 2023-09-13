"use client";

import { SettingsChangedIndicator, Toggle } from "@/components";
import { updateRoleById } from "@/utilities/api/api";
import { queryClient } from "@/utilities/react-query/react-query";
import { useAuthStore } from "@/stores/auth";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";

const permissions = [
	{
		blockTitle: "SERVER PERMISSIONS",
		items: [
			{
				name: "View Server Settings",
				description: "Can view server settings.",
				key: "GET_SERVER_SETTING",
			},
			{
				name: "Update Server Settings",
				description: "Can update server settings.",
				key: "UPDATE_SERVER_SETTING",
			},
		],
	},
	{
		blockTitle: "USER PERMISSIONS",
		items: [
			{
				name: "Create Users",
				description: "Can create users.",
				key: "CREATE_USER",
			},
			{
				name: "View Users",
				description: "Can view users.",
				key: "GET_USERS",
			},
			{
				name: "Update User",
				description: "Can update users.",
				key: "UPDATE_USER",
			},
			{
				name: "Delete User",
				description: "Can delete users.",
				key: "DELETE_USER",
			},
			{
				name: "Update Me",
				description: "Can update their own",
				key: "UPDATE_ME",
			},
		],
	},
	{
		blockTitle: "ROLE PERMISSIONS",
		items: [
			{
				name: "Create Roles",
				description: "Can create roles.",
				key: "CREATE_ROLE",
			},
			{
				name: "View Roles",
				description: "Can view roles.",
				key: "GET_ROLES",
			},
			{
				name: "Update Roles",
				description: "Can update roles.",
				key: "UPDATE_ROLE",
			},
			{
				name: "Delete Roles",
				description: "Can delete roles.",
				key: "DELETE_ROLE",
			},
		],
	},
	{
		blockTitle: "GROUP PERMISSIONS",
		items: [
			{
				name: "Create Groups",
				description: "Can create groups.",
				key: "CREATE_GROUP",
			},
			{
				name: "View Groups",
				description: "Can view groups.",
				key: "GET_GROUPS",
			},
			{
				name: "Update Groups",
				description: "Can update groups.",
				key: "UPDATE_GROUP",
			},
			{
				name: "Delete Groups",
				description: "Can delete groups.",
				key: "DELETE_GROUP",
			},
		],
	},
];

const PermissionItem = (props: any) => {
	const {
		itemName,
		description,
		permissionKey,
		newValues,
		setNewValues,
		activeRoleName,
	} = props;

	return (
		<div className="flex flex-col gap-4">
			<div
				className="flex justify-between 
                text-gray-800 text-base font-mono"
			>
				<div>{itemName}</div>
				<Toggle
					isOn={newValues.includes(permissionKey)}
					isAllowed={activeRoleName !== "admin"}
					onClick={() => {
						if (newValues.includes(permissionKey)) {
							setNewValues(
								newValues
									.filter(
										(value: string) =>
											value !== permissionKey
									)
									.sort()
							);
						} else {
							setNewValues([...newValues, permissionKey].sort());
						}
					}}
				/>
			</div>
			<div className="font-normal">{description}</div>
			<hr />
		</div>
	);
};

const PermissionBlock = (props: any) => {
	const { title, children } = props;
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-gray-500 text-xs">{title}</h1>
			{children}
		</div>
	);
};

export const PermissionsPage = (props: any) => {
	const { rolesQuery, activeRoleId } = props;
	const activeRole = rolesQuery.data.find((role: any) => {
		return role.id === activeRoleId;
	});
	const currentPermissions = activeRole.permissions;

	const { accessToken } = useAuthStore();
	const [newValues, setNewValues] = useState<string[]>([]);
	const [showSettingsChangedIndicator, setShowSettingsChangedIndicator] =
		useState<boolean>(false);
	const [activeRoleName, setActiveRoleName] = useState<string>("");

	const mutation = useMutation({
		mutationFn: () => {
			return updateRoleById(
				{ permissions: newValues },
				activeRoleId,
				accessToken
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getRoles", accessToken],
			});
			setShowSettingsChangedIndicator(false);
		},
		onError: () => {
			// setShowSettingsChangedIndicator(true);
		},
	});

	function onReset() {
		setNewValues(currentPermissions);
	}

	function onSave() {
		mutation.mutate();
	}

	useEffect(() => {
		setActiveRoleName(activeRole.name);
		if (currentPermissions) {
			setNewValues(currentPermissions.sort());
		} else {
			setNewValues([]);
		}
	}, [activeRoleId]);

	useEffect(() => {
		if (JSON.stringify(currentPermissions) !== JSON.stringify(newValues)) {
			setShowSettingsChangedIndicator(true);
		} else {
			setShowSettingsChangedIndicator(false);
		}
	}, [newValues]);

	return (
		<div
			className="flex flex-col pb-20 gap-10
			overflow-y-auto scrollbar-hide"
		>
			{permissions.map((permissionBlock) => {
				return (
					<PermissionBlock
						key={permissionBlock.blockTitle}
						title={permissionBlock.blockTitle}
					>
						{permissionBlock.items.map((permissionItem) => {
							return (
								<PermissionItem
									key={permissionItem.key}
									itemName={permissionItem.name}
									description={permissionItem.description}
									permissionKey={permissionItem.key}
									newValues={newValues}
									setNewValues={setNewValues}
									activeRoleName={activeRoleName}
								/>
							);
						})}
					</PermissionBlock>
				);
			})}

			<AnimatePresence>
				{showSettingsChangedIndicator && (
					<SettingsChangedIndicator
						onReset={onReset}
						onSave={onSave}
						isLoading={mutation.isLoading}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};
