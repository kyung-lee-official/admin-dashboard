"use client";

import React, { useEffect, useState } from "react";
import { SettingsHeading, SettingsSubHeading } from "../../ContentRegion";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import { AnimatePresence } from "framer-motion";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	getServerSettings,
	updateServerSettings,
} from "@/utils/api/server-settings";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Toggle } from "@/components/toggle/Toggle";
import { SettingsChangedIndicator } from "../../SettingsChangedIndicator";

export const Server = (props: any) => {
	const { jwt } = useAuthStore();
	const [newData, setNewData] = useState<any>(null);
	const [showSettingsChangedIndicator, setShowSettingsChangedIndicator] =
		useState<boolean>(false);

	const getServerSettingsQuery = useQuery<any, AxiosError>({
		queryKey: ["get-server-settings", jwt],
		queryFn: async () => {
			const serverSettings = await getServerSettings(jwt);
			return serverSettings;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const mutation = useMutation({
		mutationFn: () => {
			return updateServerSettings(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-server-settings", jwt],
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
					<div className="flex justify-between items-center">
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
					<div className="flex justify-between items-center">
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
						isLoading={mutation.isPending}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};
