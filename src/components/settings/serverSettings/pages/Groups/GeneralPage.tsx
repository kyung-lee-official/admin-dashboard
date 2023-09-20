"use client";

import { SettingsChangedIndicator } from "@/components/settings/SettingsChangedIndicator";
import { useAuthStore } from "@/stores/auth";
import { updateGroupById } from "@/utilities/api/api";
import { queryClient } from "@/utilities/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export const GeneralPage = (props: any) => {
	const { groupsQuery, activeGroupId } = props;
	const activeGroup = groupsQuery.data.find(
		(group: any) => group.id === activeGroupId
	);

	const { accessToken } = useAuthStore();
	const [newGroupName, setNewGroupName] = useState<string>(activeGroup.name);
	const [showSettingsChangedIndicator, setShowSettingsChangedIndicator] =
		useState<boolean>(false);

	const mutation = useMutation({
		mutationFn: () => {
			return updateGroupById(
				{ name: newGroupName },
				activeGroupId,
				accessToken
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getGroups", accessToken],
			});
			setShowSettingsChangedIndicator(false);
		},
		onError: () => {},
	});

	const onNameChanged = (e: any) => {
		setNewGroupName(e.target.value ?? "");
	};

	function onReset() {
		setNewGroupName(activeGroup.name);
	}

	function onSave() {
		mutation.mutate();
	}

	useEffect(() => {
		setNewGroupName(activeGroup.name);
	}, [activeGroup.name]);

	useEffect(() => {
		if (JSON.stringify(activeGroup.name) !== JSON.stringify(newGroupName)) {
			setShowSettingsChangedIndicator(true);
		} else {
			setShowSettingsChangedIndicator(false);
		}
	}, [newGroupName]);

	return (
		<div className="flex flex-col gap-2 w-full">
			<div>
				GROUP NAME <span className="text-red-400">*</span>
			</div>
			<input
				type="text"
				value={newGroupName}
				className={
					activeGroup.name === "everyone"
						? `w-full h-9 px-2
					text-gray-500
					bg-gray-200 rounded placeholder-gray-500 focus:outline-none cursor-not-allowed`
						: `w-full h-9 px-2
					bg-gray-200 rounded placeholder-gray-500 focus:outline-none`
				}
				readOnly={activeGroup.name === "everyone"}
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
