"use client";

import { SettingsChangedIndicator } from "@/components/settings/SettingsChangedIndicator";
import { queryClient } from "@/utils/react-query/react-query";
import { useAuthStore } from "@/stores/auth";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateRoleById } from "@/utils/api/roles";

export const GeneralPage = (props: any) => {
	const { rolesQuery, activeRoleId } = props;
	const activeRole = rolesQuery.data.find(
		(role: any) => role.id === activeRoleId
	);

	const { jwt } = useAuthStore();
	const [newRoleName, setNewRoleName] = useState<string>(activeRole.name);
	const [showSettingsChangedIndicator, setShowSettingsChangedIndicator] =
		useState<boolean>(false);

	const mutation = useMutation({
		mutationFn: () => {
			return updateRoleById(
				{ name: newRoleName },
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
						activeRole.name === "default") &&
					"text-neutral-500"
				}
				bg-neutral-200 rounded
				placeholder-neutral-500 focus:outline-none ${
					(activeRole.name === "admin" ||
						activeRole.name === "default") &&
					"cursor-not-allowed"
				}`}
				readOnly={
					activeRole.name === "admin" || activeRole.name === "default"
				}
				onChange={onNameChanged}
			/>
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
