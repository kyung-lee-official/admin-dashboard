import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { createTemplate, PerformanceQK } from "@/utils/api/app/performance";
import { MemberRole } from "@/utils/types/internal";
import { CreatePerformanceEventTemplate } from "@/utils/types/app/performance";
import { RolesQK, getAllRoles } from "@/utils/api/roles";
import { AxiosError } from "axios";
import { Dropdown } from "@/components/input/dropdown/Dropdown";
import { DecimalInput } from "@/components/input/decimal-input/DecimalInput";

export const EditContentAddTemplate = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.ADD_TEMPLATE;
	const title = "Add Template";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const [oldData, setOldData] = useState<CreatePerformanceEventTemplate>({
		score: 0,
		description: "",
		memberRole: null,
	});
	const [newData, setNewData] = useState(oldData);
	const [score, setScore] = useState<number>(oldData.score);
	const [description, setDescription] = useState<string>(oldData.description);
	const [role, setRole] = useState<MemberRole | MemberRole[] | null>(
		oldData.memberRole
	);

	const rolesQuery = useQuery<MemberRole[], AxiosError>({
		queryKey: [RolesQK.GET_ALL_ROLES],
		queryFn: async () => {
			const roles = await getAllRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		setNewData({
			score: score,
			description: description,
			memberRole: role as MemberRole | null,
		});
	}, [score, description, role]);

	const mutation = useMutation({
		mutationFn: () => {
			const dto = {
				score: newData.score,
				description: newData.description,
				memberRoleId: newData.memberRole?.id,
			};
			return createTemplate(dto, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_TEMPLATES_BY_ROLE_ID],
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
				<div
					className="flex flex-col gap-1.5
					text-sm"
				>
					Score
					<DecimalInput
						onChange={(v) => {
							setScore(v as number);
						}}
					/>
				</div>
				<div
					className="flex flex-col gap-1.5
					text-sm"
				>
					Description
					<input
						type="text"
						className="px-2 py-1.5
						bg-white/10
						rounded-md outline-none
						border-[1px] border-white/10"
						onChange={(e) => {
							setDescription(e.target.value);
						}}
					/>
				</div>
			</form>
		</EditContentRegular>
	);
};
