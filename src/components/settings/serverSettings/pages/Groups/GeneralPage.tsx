"use client";

import { SettingsChangedIndicator } from "@/components/settings/SettingsChangedIndicator";
import { useAuthStore } from "@/stores/auth";
import { updateGroupById } from "@/utils/api/groups";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export const GeneralPage = (props: any) => {
	const { groupsQuery, activeGroupId } = props;
	const activeGroup = groupsQuery.data.find(
		(group: any) => group.id === activeGroupId
	);

	const { jwt } = useAuthStore();
	const [newGroupName, setNewGroupName] = useState<string>(activeGroup.name);
	const [showSettingsChangedIndicator, setShowSettingsChangedIndicator] =
		useState<boolean>(false);

	const mutation = useMutation({
		mutationFn: () => {
			return updateGroupById(
				{ name: newGroupName },
				activeGroupId,
				jwt
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getGroups", jwt],
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
					text-neutral-500
					bg-neutral-200 rounded placeholder-neutral-500 focus:outline-none cursor-not-allowed`
						: `w-full h-9 px-2
					bg-neutral-200 rounded placeholder-neutral-500 focus:outline-none`
				}
				readOnly={activeGroup.name === "everyone"}
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
