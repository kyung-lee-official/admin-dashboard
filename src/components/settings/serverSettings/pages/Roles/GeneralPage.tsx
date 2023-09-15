"use client";

import { SettingsChangedIndicator } from "@/components/settings/SettingsChangedIndicator";
import { updateRoleById } from "@/utilities/api/api";
import { queryClient } from "@/utilities/react-query/react-query";
import { useAuthStore } from "@/stores/auth";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

export const GeneralPage = (props: any) => {
	const { rolesQuery, activeRoleId } = props;
	const activeRole = rolesQuery.data.find(
		(role: any) => role.id === activeRoleId
	);

	const { accessToken } = useAuthStore();
	const [newRoleName, setNewRoleName] = useState<string>(activeRole.name);
	const [showSettingsChangedIndicator, setShowSettingsChangedIndicator] =
		useState<boolean>(false);

	const mutation = useMutation({
		mutationFn: () => {
			return updateRoleById(
				{ name: newRoleName },
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
		onError: () => {},
	});

	const onNameChanged = (e: any) => {
		setNewRoleName(e.target.value ?? "");
	};

	function onReset() {
		setNewRoleName(activeRole.name);
	}

	function onSave() {
		mutation.mutate();
	}

	useEffect(() => {
		setNewRoleName(activeRole.name);
	}, [activeRole.name]);

	useEffect(() => {
		if (JSON.stringify(activeRole.name) !== JSON.stringify(newRoleName)) {
			setShowSettingsChangedIndicator(true);
		} else {
			setShowSettingsChangedIndicator(false);
		}
	}, [newRoleName]);

	return (
		<div className="flex flex-col gap-2 w-full">
			<div>
				ROLE NAME <span className="text-red-400">*</span>
			</div>
			<input
				type="text"
				value={newRoleName}
				className={`w-full h-9 px-2
				${
					(activeRole.name === "admin" ||
						activeRole.name === "common") &&
					"text-gray-500"
				}
				bg-gray-200 rounded
				placeholder-gray-500 focus:outline-none ${
					(activeRole.name === "admin" ||
						activeRole.name === "common") &&
					"cursor-not-allowed"
				}`}
				readOnly={
					activeRole.name === "admin" || activeRole.name === "common"
				}
				onChange={onNameChanged}
			/>
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
