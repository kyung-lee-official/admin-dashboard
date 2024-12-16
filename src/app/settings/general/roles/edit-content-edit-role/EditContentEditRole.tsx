import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { getRoleById, RolesQK, updateRoleById } from "@/utils/api/roles";
import { AxiosError } from "axios";
import { EditMembers } from "./EditMembers";
import { Member } from "@/utils/types/internal";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { sortByProp } from "@/utils/data/data";

export type EditRoleData = {
	id: string;
	name: string;
	members: Member[];
};

export const EditContentEditRole = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.EDIT_ROLE;
	const title = "Edit Role";
	const { edit, setEdit } = props;
	const { roleId } = edit.auxData;

	const jwt = useAuthStore((state) => state.jwt);

	const roleQuery = useQuery<EditRoleData, AxiosError>({
		queryKey: [RolesQK.GET_ROLE_BY_ID, jwt],
		queryFn: async () => {
			const role = await getRoleById(jwt, roleId);
			return role;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [oldData, setOldData] = useState<EditRoleData>({
		id: "",
		name: "",
		members: [],
	});
	const [newData, setNewData] = useState<EditRoleData>(oldData);

	useEffect(() => {
		if (roleQuery.isSuccess) {
			const sortedData = {
				id: roleQuery.data.id,
				name: roleQuery.data.name,
				members: sortByProp(roleQuery.data.members, "name"),
			};
			setOldData(sortedData);
			setNewData(sortedData);
		}
	}, [roleQuery.data]);

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
				queryKey: [RolesQK.GET_ROLES_BY_IDS, jwt],
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
			<form action={onSave} className="flex-[1_0_100px] flex flex-col">
				<div className="flex-[1_0_100px] flex flex-col px-6 py-4 gap-6">
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
									members: sortByProp(
										newData.members,
										"name"
									),
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
									members: sortByProp(
										newData.members,
										"name"
									),
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
			</form>
		</EditContentRegular>
	);
};
