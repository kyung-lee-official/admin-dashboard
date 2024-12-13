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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { EditProps } from "@/components/edit-panel/EditPanel";
import { UnsavedDialog } from "@/components/edit-panel/UnsavedDialog";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";

export const EditContentSignUp = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = "sign-up";
	const { edit, setEdit } = props;

	const listenerRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	const jwt = useAuthStore((state) => state.jwt);
	const [newData, setNewData] = useState<any>(null);

	const [isChanged, setIsChanged] = useState(false);
	const isChangedRef = useRef(isChanged);
	const _setIsChanged = (data: any) => {
		isChangedRef.current = data;
		setIsChanged(data);
	};
	const [showUnsaved, setShowUnsaved] = useState(false);

	const getServerSettingsQuery = useQuery<any, AxiosError>({
		queryKey: [ServerSettingQK.GET_SERVER_SETTINGS, jwt],
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
	}, [getServerSettingsQuery.data]);

	const mutation = useMutation({
		mutationFn: () => {
			return updateServerSettings(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [ServerSettingQK.GET_SERVER_SETTINGS, jwt],
			});
			setIsChanged(false);
			setEdit({ show: false, id: editId });
		},
		onError: () => {},
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
			_setIsChanged(true);
		} else {
			_setIsChanged(false);
		}
	}, [newData]);

	function quit() {
		if (isChangedRef.current) {
			setShowUnsaved(true);
		} else {
			setEdit({ show: false, id: editId });
		}
	}

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (!listenerRef.current) {
				return;
			}
			if (listenerRef.current === event.target) {
				quit();
			}
		}
		listenerRef.current?.addEventListener("click", handleClickOutside);
		return () => {
			listenerRef.current?.removeEventListener(
				"click",
				handleClickOutside
			);
		};
	}, [isChanged]);

	return (
		<EditContentRegular
			title="Sign Up"
			editId={editId}
			edit={edit}
			setEdit={setEdit}
			onSave={onSave}
			newData={newData}
			oldData={getServerSettingsQuery.data}
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
			</form>
			<UnsavedDialog
				edit={edit}
				setEdit={setEdit}
				showUnsaved={showUnsaved}
				setShowUnsaved={setShowUnsaved}
			/>
		</EditContentRegular>
	);
};
