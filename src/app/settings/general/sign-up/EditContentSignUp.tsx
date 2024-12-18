import { Toggle } from "@/components/toggle/Toggle";
import { useAuthStore } from "@/stores/auth";
import {
	getServerSettings,
	ServerSettingQK,
	updateServerSettings,
} from "@/utils/api/server-settings";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";

export const EditContentSignUp = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.SIGN_UP;
	const title = "Edit Sign Up";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const getServerSettingsQuery = useQuery<any, AxiosError>({
		queryKey: [ServerSettingQK.GET_SERVER_SETTINGS, jwt],
		queryFn: async () => {
			const serverSettings = await getServerSettings(jwt);
			return serverSettings;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [oldData, setOldData] = useState<any>({
		allowPublicSignUp: false,
		allowGoogleSignIn: false,
	});
	const [newData, setNewData] = useState<any>(oldData);
	const [allowPublicSignUp, setAllowPublicSignUp] = useState(
		oldData.allowPublicSignUp
	);
	const [allowGoogleSignIn, setAllowGoogleSignIn] = useState(
		oldData.allowGoogleSignIn
	);

	useEffect(() => {
		if (getServerSettingsQuery.isSuccess) {
			const initialData = {
				allowPublicSignUp:
					getServerSettingsQuery.data.allowPublicSignUp,
				allowGoogleSignIn:
					getServerSettingsQuery.data.allowGoogleSignIn,
			};
			setOldData(initialData);
			setNewData(initialData);
			setAllowPublicSignUp(initialData.allowPublicSignUp);
			setAllowGoogleSignIn(initialData.allowGoogleSignIn);
		}
	}, [getServerSettingsQuery.data]);

	useEffect(() => {
		setNewData({
			allowPublicSignUp: allowPublicSignUp,
			allowGoogleSignIn: allowGoogleSignIn,
		});
	}, [allowPublicSignUp, allowGoogleSignIn]);

	const mutation = useMutation({
		mutationFn: () => {
			return updateServerSettings(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [ServerSettingQK.GET_SERVER_SETTINGS, jwt],
			});
			setEdit({ show: false, id: editId });
		},
		onError: () => {},
	});

	function onSave() {
		mutation.mutate();
	}

	return (
		<EditContentRegular
			title={title}
			editId={editId}
			edit={edit}
			setEdit={setEdit}
			onSave={onSave}
			newData={newData}
			oldData={oldData}
		>
			<form className="flex-[1_0_100px] flex flex-col">
				<div className="flex-[1_0_100px] flex flex-col px-6 py-4">
					<table className="text-sm">
						<tbody className="[&_>_tr_>_td]:py-4">
							<tr>
								<td className="w-full">Allow public sign up</td>
								<td>
									<Toggle
										isOn={newData?.allowPublicSignUp}
										isAllowed={true}
										onClick={() => {
											setAllowPublicSignUp(
												!allowPublicSignUp
											);
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
											setAllowGoogleSignIn(
												!allowGoogleSignIn
											);
										}}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</form>
		</EditContentRegular>
	);
};
