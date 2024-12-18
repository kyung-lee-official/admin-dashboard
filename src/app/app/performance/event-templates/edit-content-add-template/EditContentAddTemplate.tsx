import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { createTemplate, PerformanceQK } from "@/utils/api/app/performance";
import { RoleSelector } from "@/components/input/selectors/RoleSelector";
import { MemberRole } from "@/utils/types/internal";
import { CreatePerformanceEventTemplate } from "@/utils/types/app/performance";

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
		memberRole: {
			id: "",
			name: "",
			superRoleId: "",
		},
	});
	const [newData, setNewData] = useState(oldData);
	const [score, setScore] = useState<number>(oldData.score);
	const [description, setDescription] = useState<string>(oldData.description);
	const [role, setRole] = useState<MemberRole>(oldData.memberRole);
	useEffect(() => {
		setNewData({
			score: score,
			description: description,
			memberRole: role,
		});
	}, [score, description, role]);

	const mutation = useMutation({
		mutationFn: () => {
			const body = {
				score: newData.score,
				description: newData.description,
				memberRoleId: newData.memberRole.id,
			};
			return createTemplate(body, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_PERFORMANCE_TEMPLATES, jwt],
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
					<RoleSelector role={role} setRole={setRole} />
					<div
						className="flex flex-col gap-1.5
						text-sm"
					>
						Score
						<input
							type="number"
							className="px-2 py-1.5
							bg-white/10
							rounded-md outline-none
							border-[1px] border-white/10"
							placeholder="integer only"
							onChange={(e) => {
								setScore(parseInt(e.target.value));
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
				</div>
			</form>
		</EditContentRegular>
	);
};
