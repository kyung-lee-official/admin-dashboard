import { CloseIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button/Button";
import { motion } from "framer-motion";
import { UnsavedDialog } from "../../../UnsavedDialog";
import { EditProps } from "../../../../../components/edit-panel/EditPanel";
import { getRoleById, updateRoleById } from "@/utils/api/roles";
import { AxiosError } from "axios";
import { EditMembers } from "./EditMembers";
import { sortByMemberName } from "./data";

export type Member = {
	id: string;
	email: string;
	name: string;
};

export type EditRoleData = {
	id: string;
	name: string;
	members: Member[];
};

export const EditContentEditRole = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = "edit-role";
	const { edit, setEdit } = props;
	const { roleId } = edit.auxData;

	const listenerRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	const { jwt } = useAuthStore();
	const [oldData, setOldData] = useState<EditRoleData>({
		id: "",
		name: "",
		members: [],
	});
	const [newData, setNewData] = useState<EditRoleData>({
		id: "",
		name: "",
		members: [],
	});

	const roleQuery = useQuery<EditRoleData, AxiosError>({
		queryKey: ["get-role-by-id", jwt],
		queryFn: async () => {
			const role = await getRoleById(jwt, roleId);
			return role;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (roleQuery.isSuccess) {
			const sortedData = {
				id: roleQuery.data.id,
				name: roleQuery.data.name,
				members: sortByMemberName(roleQuery.data.members),
			};
			setOldData(sortedData);
			setNewData(sortedData);
		}
	}, [roleQuery.data]);

	const [isChanged, setIsChanged] = useState(false);
	const isChangedRef = useRef(isChanged);
	const _setIsChanged = (data: any) => {
		isChangedRef.current = data;
		setIsChanged(data);
	};
	const [showUnsaved, setShowUnsaved] = useState(false);

	const mutation = useMutation({
		mutationFn: () => {
			const body = {
				id: newData.id,
				name: newData.name,
				ids: newData.members.map((member) => member.id),
			};
			return updateRoleById(body, roleId, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-roles", jwt],
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
			JSON.stringify({
				id: newData.id,
				name: newData.name,
				members: sortByMemberName(newData.members),
			}) !== JSON.stringify(oldData)
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
					<div>Edit Role</div>
					<button
						className="flex justify-center items-center w-7 h-7
						text-white/50
						hover:bg-white/10 rounded-md"
						onClick={(e) => {
							e.preventDefault();
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
						className="flex-[1_0_100px] flex flex-col px-6 py-4 gap-6
						border-b-[1px] border-white/10"
					>
						<div
							className="flex flex-col gap-1.5
							text-sm"
						>
							Role Id
							<input
								type="text"
								className="px-2 py-1.5
								bg-white/10
								rounded-md outline-none
								border-[1px] border-white/10"
								value={newData.id}
								onChange={(e) => {
									setNewData({
										id: e.target.value,
										name: newData.name,
										members: newData.members,
									});
								}}
							/>
						</div>
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
										id: newData.id,
										name: e.target.value,
										members: newData.members,
									});
								}}
							/>
						</div>
						<div
							className="flex flex-col gap-1.5
							text-sm"
						>
							Members
							<EditMembers
								newData={newData}
								setNewData={setNewData}
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
