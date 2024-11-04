"use client";

import { Toggle } from "@/components/toggle/Toggle";
import { useAuthStore } from "@/stores/auth";
import {
	getServerSettings,
	updateServerSettings,
} from "@/utils/api/server-settings";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export const Content = () => {
	const { jwt } = useAuthStore();
	const [newData, setNewData] = useState<any>(null);
	const [isChanged, setIsChanged] = useState(false);

	const getServerSettingsQuery = useQuery<any, AxiosError>({
		queryKey: ["get-server-settings", jwt],
		queryFn: async () => {
			const serverSettings = await getServerSettings(jwt);
			return serverSettings;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (getServerSettingsQuery.isSuccess) {
			setNewData(getServerSettingsQuery.data);
		}
	}, [getServerSettingsQuery.isSuccess]);

	const mutation = useMutation({
		mutationFn: () => {
			return updateServerSettings(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-server-settings", jwt],
			});
			setIsChanged(false);
		},
		onError: () => {
			// setShowSettingsChangedIndicator(true);
		},
	});

	function onSave() {
		mutation.mutate();
	}

	useEffect(() => {
		if (
			newData &&
			JSON.stringify(newData) !==
				JSON.stringify(getServerSettingsQuery.data)
		) {
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
	}, [newData]);

	return (
		<div className="w-full max-w-[1600px] p-3">
			<div
				className="text-white/90
				bg-white/5
				rounded-md border-[1px] border-white/10 border-t-white/15"
			>
				<div className="px-6 py-4">
					<div className="text-lg font-semibold">Sign Up</div>
				</div>
				<table className="text-sm text-white/50">
					<tbody
						className="[&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:py-4
						[&_>_tr_>_td]:border-t [&_>_tr_>_td]:border-white/10"
					>
						<tr>
							<td className="w-full">Allow public sign up</td>
							<td>
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
							</td>
						</tr>
						<tr>
							<td>Allow Google sign up</td>
							<td>
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
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};
