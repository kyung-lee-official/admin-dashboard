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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button/Button";
import { motion } from "framer-motion";
import { UnsavedDialog } from "../../UnsavedDialog";
import { EditProps } from "../../EditPanel";

export const EditContentSignUp = (props: {
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = "sign-up";
	const { setEdit } = props;

	const panelRef = useRef<HTMLDivElement>(null);

	const unsavedDialogRef = useRef<HTMLDialogElement>(null);

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
			setIsChanged(true);
		} else {
			setIsChanged(false);
		}
	}, [newData]);

	function quit() {
		if (isChanged) {
			if (unsavedDialogRef.current) {
				unsavedDialogRef.current.showModal();
			}
		} else {
			setEdit({ show: false, id: editId });
		}
	}

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (!panelRef.current) {
				return;
			}
			if (!panelRef.current.contains(event.target)) {
				quit();
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [panelRef, isChanged]);

	return (
		<motion.div
			ref={panelRef}
			initial={{ x: "100%" }}
			animate={{ x: "0%" }}
			transition={{ duration: 0.1 }}
			className="flex flex-col h-[calc(100svh-16px)] w-full max-w-[560px] m-2
			text-white/90
			bg-neutral-900
			rounded-lg border-[1px] border-neutral-700 border-t-neutral-600"
		>
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
						quit();
					}}
				>
					<CloseIcon size={15} />
				</button>
			</div>
			<form action={onSave} className="flex-[1_0_100px] flex flex-col">
				<div
					className="flex-[1_0_100px] flex flex-col px-6 py-4
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
					<Button
						color="cancel"
						size="sm"
						onClick={(e) => {
							e.preventDefault();
							quit();
						}}
					>
						Cancel
					</Button>
					<Button type="submit" size="sm">
						Save
					</Button>
				</div>
			</form>
			<UnsavedDialog ref={unsavedDialogRef} setEdit={setEdit} />
		</motion.div>
	);
};
