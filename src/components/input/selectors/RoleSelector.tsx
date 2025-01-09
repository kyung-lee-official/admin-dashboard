import { MemberRole } from "@/utils/types/internal";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { getAllRoles, RolesQK } from "@/utils/api/roles";
import { DropdownInput } from "../dropdown-input/DropdownInput";

type RoleSelectorProps = {
	role: MemberRole | undefined;
	setRole: Dispatch<SetStateAction<MemberRole | undefined>>;
};

export const RoleSelector = (props: RoleSelectorProps) => {
	const jwt = useAuthStore((state) => state.jwt);

	const rolesQuery = useQuery<MemberRole[], AxiosError>({
		queryKey: [RolesQK.GET_ALL_ROLES, jwt],
		queryFn: async () => {
			const roles = await getAllRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const { role, setRole } = props;

	return (
		<DropdownInput
			kind="object"
			mode="search"
			selected={role}
			setSelected={setRole}
			options={rolesQuery.data ?? []}
			placeholder="Select a role"
			label={{ primaryKey: "name", secondaryKey: "id" }}
			sortBy="name"
		/>
	);
};
