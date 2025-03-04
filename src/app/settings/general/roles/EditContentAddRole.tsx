import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { createRole, getAllRoles, RolesQK } from "@/utils/api/roles";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { MemberRole } from "@/utils/types/internal";
import { Dropdown } from "@/components/input/dropdown/Dropdown";
import { AxiosError } from "axios";

export const EditContentAddRole = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.ADD_ROLE;
	const title = "Add Role";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);
	const oldData: MemberRole = {
		id: "",
		name: "",
		superRole: undefined,
	};
	const [newData, setNewData] = useState(oldData);
	const [id, setId] = useState(oldData.id);
	const [name, setName] = useState(oldData.name);
	const [superRole, setSuperRole] = useState<MemberRole>();

	const [role, setRole] = useState<MemberRole | undefined>(undefined);
	const rolesQuery = useQuery<MemberRole[], AxiosError>({
		queryKey: [RolesQK.GET_ALL_ROLES],
		queryFn: async () => {
			const roles = await getAllRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const mutation = useMutation({
		mutationFn: () => {
			return createRole(
				{
					id: newData.id,
					name: newData.name,
					superRoleId: newData.superRole?.id,
				},
				jwt
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [RolesQK.GET_ROLES_BY_IDS],
			});
			setEdit({ show: false, id: editId });
		},
		onError: () => {},
	});

	useEffect(() => {
		setNewData({
			id: id,
			name: name,
			superRole: superRole,
		});
	}, [id, name, superRole]);

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
			<form action={onSave} className="flex flex-col px-6 py-4 gap-6">
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
						onChange={(e) => {
							setId(e.target.value);
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
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
				</div>
				<div
					className="flex flex-col gap-1.5
					text-sm"
				>
					Super Role
					<Dropdown
						kind="object"
						mode="search"
						selected={role}
						setSelected={setRole}
						options={rolesQuery.data ?? []}
						placeholder="Select a role"
						label={{ primaryKey: "name", secondaryKey: "id" }}
						sortBy="name"
					/>
				</div>
			</form>
		</EditContentRegular>
	);
};
