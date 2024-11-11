"use client";

import { queryClient } from "@/utils/react-query/react-query";
import { useAuthStore } from "@/stores/auth";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateRoleById } from "@/utils/api/roles";
import { SettingsChangedIndicator } from "@/components/settings/SettingsChangedIndicator";
import { Toggle } from "@/components/toggle/Toggle";
import { Permissions } from "@/components/sacl/Permissions";

const permissions = [
	{
		blockTitle: "SERVER PERMISSIONS",
		items: [
			{
				name: "View Server Settings",
				description: "Can view server settings.",
				key: Permissions.GET_MEMBER_SERVER_SETTING,
			},
			{
				name: "Update Server Settings",
				description: "Can update server settings.",
				key: Permissions.UPDATE_MEMBER_SERVER_SETTING,
			},
		],
	},
	{
		blockTitle: "MEMBER PERMISSIONS",
		items: [
			{
				name: "Create Members",
				description: "Can create members.",
				key: Permissions.CREATE_MEMBER,
			},
			{
				name: "View Members",
				description: "Can view members.",
				key: Permissions.GET_MEMBERS,
			},
			{
				name: "Update Member",
				description: "Can update members.",
				key: Permissions.UPDATE_MEMBER,
			},
			{
				name: "Delete Member",
				description: "Can delete members.",
				key: Permissions.DELETE_MEMBER,
			},
			{
				name: "Update Me",
				description: "Can update their own",
				key: Permissions.UPDATE_MEMBER_ME,
			},
		],
	},
	{
		blockTitle: "ROLE PERMISSIONS",
		items: [
			{
				name: "Create Roles",
				description: "Can create roles.",
				key: Permissions.CREATE_MEMBER_ROLE,
			},
			{
				name: "View Roles",
				description: "Can view roles.",
				key: Permissions.GET_MEMBER_ROLES,
			},
			{
				name: "Update Roles",
				description: "Can update roles.",
				key: Permissions.UPDATE_MEMBER_ROLE,
			},
			{
				name: "Delete Roles",
				description: "Can delete roles.",
				key: Permissions.DELETE_MEMBER_ROLE,
			},
		],
	},
	{
		blockTitle: "GROUP PERMISSIONS",
		items: [
			{
				name: "Create Groups",
				description: "Can create groups.",
				key: Permissions.CREATE_MEMBER_GROUP,
			},
			{
				name: "View Groups",
				description: "Can view groups.",
				key: Permissions.GET_MEMBER_GROUPS,
			},
			{
				name: "Update Groups",
				description: "Can update groups.",
				key: Permissions.UPDATE_MEMBER_GROUP,
			},
			{
				name: "Delete Groups",
				description: "Can delete groups.",
				key: Permissions.DELETE_MEMBER_GROUP,
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
                text-neutral-800 text-base"
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
			<h1 className="text-neutral-500 text-xs">{title}</h1>
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

	const { jwt } = useAuthStore();
	const [newValues, setNewValues] = useState<string[]>([]);
	const [showSettingsChangedIndicator, setShowSettingsChangedIndicator] =
		useState<boolean>(false);
	const [activeRoleName, setActiveRoleName] = useState<string>("");

	const mutation = useMutation({
		mutationFn: () => {
			return updateRoleById(
				{ permissions: newValues },
				activeRoleId,
				jwt
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getRoles", jwt],
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
						isLoading={mutation.isPending}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};
