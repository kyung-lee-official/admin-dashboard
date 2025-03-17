import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import {
	getAllRoles,
	getRoleById,
	RolesQK,
	updateRoleById,
} from "@/utils/api/roles";
import { AxiosError } from "axios";
import { EditMembers } from "./EditMembers";
import { Member, MemberRole } from "@/utils/types/internal";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { sortByProp } from "@/utils/data/data";
import { Dropdown } from "@/components/input/dropdown/Dropdown";

export type EditRoleData = {
	id: string;
	name: string;
	superRole: MemberRole | null;
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

	// const [role, setRole] = useState<MemberRole | undefined>(undefined);
	const rolesQuery = useQuery<MemberRole[], AxiosError>({
		queryKey: [RolesQK.GET_ALL_ROLES],
		queryFn: async () => {
			const roles = await getAllRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	/* filter out current role, and add a null option for no super role */
	const roles = (
		rolesQuery.data?.filter((r) => r.id !== roleId) ?? []
	).concat({
		id: "",
		name: "No Super Role",
		superRole: null,
	});

	const roleQuery = useQuery<EditRoleData, AxiosError>({
		queryKey: [RolesQK.GET_ROLE_BY_ID],
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
		superRole: null,
		members: [],
	});
	const [newData, setNewData] = useState<EditRoleData>(oldData);
	const [id, setId] = useState(oldData.id);
	const [name, setName] = useState(oldData.name);
	const [superRole, setSuperRole] = useState<
		MemberRole | MemberRole[] | null
	>(oldData.superRole);
	const [members, setMembers] = useState<Member[]>(oldData.members);

	useEffect(() => {
		if (roleQuery.isSuccess) {
			const dbData = {
				id: roleQuery.data.id,
				name: roleQuery.data.name,
				superRole: roleQuery.data.superRole,
				members: sortByProp(roleQuery.data.members, "name"),
			};

			setOldData(dbData);
			setNewData(dbData);
			setId(dbData.id);
			setName(dbData.name);
			setSuperRole(dbData.superRole ? dbData.superRole : null);
			setMembers(dbData.members);
		}
	}, [roleQuery.data]);

	useEffect(() => {
		setNewData({
			id: id,
			name: name,
			superRole: superRole as MemberRole | null,
			members: sortByProp(members, "name"),
		});
	}, [id, name, superRole, members]);

	const mutation = useMutation({
		mutationFn: () => {
			const dto = {
				id: newData.id,
				name: newData.name,
				superRoleId:
					newData.superRole?.id === ""
						? undefined
						: newData.superRole?.id,
				memberIds: newData.members.map((member) => member.id),
			};
			return updateRoleById(dto, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [RolesQK.GET_ROLES_BY_IDS],
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
						value={newData.id}
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
						value={newData.name}
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
						selected={superRole}
						setSelected={setSuperRole}
						options={roles ?? []}
						placeholder="Select a role"
						label={{ primaryKey: "name", secondaryKey: "id" }}
						sortBy="name"
					/>
				</div>
				<div
					className="flex flex-col gap-1.5
					text-sm"
				>
					Members
					<EditMembers members={members} setMembers={setMembers} />
				</div>
			</form>
		</EditContentRegular>
	);
};
