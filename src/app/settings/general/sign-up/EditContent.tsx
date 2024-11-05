import { CloseIcon } from "@/components/icons/Icons";
import { Toggle } from "@/components/toggle/Toggle";
import { useAuthStore } from "@/stores/auth";
import {
	getServerSettings,
	updateServerSettings,
} from "@/utils/api/server-settings";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditProps } from "./Content";
import { Button } from "@/components/button/Button";

export const EditContent = (props: {
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const { setEdit } = props;

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
		<>
			<div
				className="flex-[0_0_61px] flex justify-between px-6 py-4
				font-semibold text-lg
				border-b-[1px] border-white/10"
			>
				<div>Sign Up</div>
				<button
					className="flex justify-center items-center w-7 h-7
					text-white/50
					hover:bg-white/10 rounded-md"
					onClick={() => {
						setEdit({ show: false, id: "sign-up" });
					}}
				>
					<CloseIcon size={15} />
				</button>
			</div>
			<div
				className="flex-[1_0_100px] px-6 py-4
				border-b-[1px] border-white/10"
			>
				<table className="text-sm">
					<tbody className="[&_>_tr_>_td]:py-4">
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
			<div className="flex-[0_0_61px] flex justify-end px-6 py-4 gap-1.5">
				<Button color="cancel" size="sm">
					Cancel
				</Button>
				<Button size="sm">Save</Button>
			</div>
		</>
	);
};
