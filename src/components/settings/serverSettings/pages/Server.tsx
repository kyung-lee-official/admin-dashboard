"use client";

import React, { useEffect, useState } from "react";
import { SettingsHeading, SettingsSubHeading } from "../../ContentRegion";
import { SettingsChangedIndicator, Skeleton, Toggle } from "@/components";
import { AxiosError } from "axios";
import { getServerSettings, updateServerSettings } from "@/utilities/api/api";
import { useAuthStore } from "@/stores/auth";
import { AnimatePresence } from "framer-motion";
import { queryClient } from "@/utilities/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

export const Server = (props: any) => {
	const { accessToken } = useAuthStore();
	const [newData, setNewData] = useState<any>(null);
	const [showSettingsChangedIndicator, setShowSettingsChangedIndicator] =
		useState<boolean>(false);

	const getServerSettingsQuery = useQuery<any, AxiosError>({
		queryKey: ["getServerSettings", accessToken],
		queryFn: async () => {
			const serverSettings = await getServerSettings(accessToken);
			return serverSettings;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const mutation = useMutation({
		mutationFn: () => {
			return updateServerSettings(newData, accessToken);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getServerSettings", accessToken],
			});
			setShowSettingsChangedIndicator(false);
		},
		onError: () => {
			// setShowSettingsChangedIndicator(true);
		},
	});

	function onReset() {
		setNewData(getServerSettingsQuery.data);
	}

	function onSave() {
		mutation.mutate();
	}

	useEffect(() => {
		if (getServerSettingsQuery.isSuccess) {
			setNewData(getServerSettingsQuery.data);
		}
	}, [getServerSettingsQuery.isSuccess]);

	useEffect(() => {
		if (
			newData &&
			JSON.stringify(newData) !==
				JSON.stringify(getServerSettingsQuery.data)
		) {
			setShowSettingsChangedIndicator(true);
		} else {
			setShowSettingsChangedIndicator(false);
		}
	}, [newData]);

	return (
		<div className="flex flex-col gap-6">
			<SettingsHeading>Server</SettingsHeading>
			<SettingsSubHeading>SIGN UP</SettingsSubHeading>
			{getServerSettingsQuery.isLoading ? (
				<Skeleton />
			) : (
				<>
					<div className="flex justify-between items-center font-mono">
						<div>Allow public sign up.</div>
						<Toggle
							isOn={newData?.allowPublicSignUp}
							isAllowed={true}
							onClick={() => {
								setNewData({
									...newData,
									allowPublicSignUp:
										!newData.allowPublicSignUp,
								});
							}}
						/>
					</div>
					<div className="flex justify-between items-center font-mono">
						<div>Allow Google sign up.</div>
						<Toggle
							isOn={newData?.allowGoogleSignIn}
							isAllowed={true}
							onClick={() => {
								setNewData({
									...newData,
									allowGoogleSignIn:
										!newData.allowGoogleSignIn,
								});
							}}
						/>
					</div>
				</>
			)}

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
