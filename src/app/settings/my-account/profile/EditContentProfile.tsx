import { CloseIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button/Button";
import { motion } from "framer-motion";
import { getMyInfo, updateProfile } from "@/utils/api/members";
import { EditProps } from "../../../../components/edit-panel/EditPanel";
import { MyInfo } from "./Content";
import { UnsavedDialog } from "@/components/edit-panel/UnsavedDialog";

export const EditContentProfile = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = "profile";
	const { edit, setEdit } = props;

	const panelRef = useRef<HTMLDivElement>(null);

	const { jwt } = useAuthStore();
	const [newData, setNewData] = useState<MyInfo>({
		id: "",
		email: "",
		name: "",
		isVerified: false,
		isFrozen: false,
		createdAt: "",
		updatedAt: "",
		memberRoles: [],
	});

	const listenerRef = useRef<HTMLDivElement>(null);
	const [isChanged, setIsChanged] = useState(false);
	const isChangedRef = useRef(isChanged);
	const _setIsChanged = (data: any) => {
		isChangedRef.current = data;
		setIsChanged(data);
	};
	const [showUnsaved, setShowUnsaved] = useState(false);

	const myInfoQuery = useQuery<MyInfo, AxiosError>({
		queryKey: ["my-info", jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (myInfoQuery.isSuccess) {
			setNewData(myInfoQuery.data);
		}
	}, [myInfoQuery.data]);

	const mutation = useMutation({
		mutationFn: () => {
			return updateProfile(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["my-info", jwt],
			});
			_setIsChanged(false);
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
			JSON.stringify(newData) !== JSON.stringify(myInfoQuery.data)
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
		<div
			ref={listenerRef}
			className="w-full h-svh
			flex justify-end items-center"
		>
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
					<div>Edit Profile</div>
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
				<form
					action={onSave}
					className="flex-[1_0_100px] flex flex-col"
				>
					<div
						className="flex-[1_0_100px] flex flex-col px-6 py-4
						border-b-[1px] border-white/10"
					>
						<div
							className="flex flex-col gap-1.5
							text-sm"
						>
							Name
							<input
								type="text"
								className="px-2 py-1.5
								bg-white/10
								rounded-md outline-none
								border-[1px] border-white/10"
								value={newData.name}
								onChange={(e) => {
									setNewData({
										...newData,
										name: e.target.value,
									});
								}}
							/>
						</div>
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
				<UnsavedDialog
					edit={edit}
					setEdit={setEdit}
					showUnsaved={showUnsaved}
					setShowUnsaved={setShowUnsaved}
				/>
			</motion.div>
		</div>
	);
};
