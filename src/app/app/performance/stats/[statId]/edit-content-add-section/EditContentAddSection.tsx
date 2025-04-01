import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { useAuthStore } from "@/stores/auth";
import { PerformanceQK, addSection } from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditSectionData } from "@/utils/types/app/performance";
import { AxiosError } from "axios";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { IntegerInput } from "@/components/input/integer-input/IntegerInput";
import { Dropdown } from "@/components/input/dropdown/Dropdown";
import { MemberRole } from "@/utils/types/internal";
import { getAllRoles, RolesQK } from "@/utils/api/roles";
import {
	EditContentRegularForm,
	EditContentRegularFormBlock,
} from "@/components/edit-panel/EditContentRegularForm";

export const EditContentAddSection = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.ADD_SECTION;
	const title = "Add Section";
	const { edit, setEdit } = props;
	const { statId } = edit.auxData;

	const jwt = useAuthStore((state) => state.jwt);
	const rolesQuery = useQuery<MemberRole[], AxiosError>({
		queryKey: [RolesQK.GET_ALL_ROLES],
		queryFn: async () => {
			const roles = await getAllRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [oldData, setOldData] = useState<EditSectionData>({
		weight: 0,
		memberRole: null,
		title: "",
		description: "",
	});
	const [newData, setNewData] = useState<EditSectionData>(oldData);
	const [weight, setWeight] = useState(oldData.weight);
	const [memberRole, setMemberRole] = useState<
		MemberRole | MemberRole[] | null
	>(oldData.memberRole);
	const [sectionTitle, setSectionTitle] = useState(oldData.title);
	const [description, setDescription] = useState(oldData.description);

	/* for updating data */
	useEffect(() => {
		setNewData({
			weight: weight,
			memberRole: memberRole as MemberRole | null,
			title: sectionTitle,
			description: description,
		});
	}, [weight, memberRole, sectionTitle, description]);

	const mutation = useMutation({
		mutationFn: () => {
			const dto = {
				statId: statId as number,
				weight: newData.weight,
				memberRoleId: newData.memberRole?.id,
				title: newData.title,
				description: newData.description,
			};
			return addSection(dto, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_STAT_BY_ID],
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
			<EditContentRegularForm>
				<EditContentRegularFormBlock title="Title">
					<input
						type="text"
						className="w-40 px-2 py-0.5
						border-[1px] border-neutral-700 border-t-neutral-600
						rounded"
						placeholder="Title"
						value={sectionTitle}
						onChange={(e) => {
							setSectionTitle(e.target.value);
						}}
					/>
				</EditContentRegularFormBlock>
				<EditContentRegularFormBlock title="Weight">
					<IntegerInput
						min={0}
						max={100}
						value={weight}
						onChange={(v: number) => {
							setWeight(v);
						}}
					/>
				</EditContentRegularFormBlock>
				<EditContentRegularFormBlock title="Section Role">
					<Dropdown
						kind="object"
						mode="search"
						selected={memberRole}
						setSelected={setMemberRole}
						options={rolesQuery.data ?? []}
						placeholder="Select a role"
						label={{
							primaryKey: "name",
							secondaryKey: "id",
						}}
						sortBy="name"
					/>
				</EditContentRegularFormBlock>
				<EditContentRegularFormBlock title="Description">
					<textarea
						placeholder={"Description"}
						className="w-full h-28 p-2
						bg-neutral-800
						border-t-[1px] border-white/20 rounded
						outline-none"
						value={description || ""}
						onChange={(e) => {
							setDescription(e.target.value);
						}}
					/>
				</EditContentRegularFormBlock>
			</EditContentRegularForm>
		</EditContentRegular>
	);
};
