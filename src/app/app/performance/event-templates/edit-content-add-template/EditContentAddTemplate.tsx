import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { createTemplate, PerformanceQK } from "@/utils/api/app/performance";

export const EditContentAddTemplate = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.ADD_TEMPLATE;
	const title = "Add Template";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const mutation = useMutation({
		mutationFn: () => {
			return createTemplate(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_PERFORMANCE_TEMPLATES, jwt],
			});
			setEdit({ show: false, id: editId });
		},
		onError: () => {},
	});

	const oldData = {
		id: "",
		name: "",
	};
	const [newData, setNewData] = useState(oldData);

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
						Score
						<input
							type="number"
							className="px-2 py-1.5
							bg-white/10
							rounded-md outline-none
							border-[1px] border-white/10"
							placeholder="integer only"
							onChange={(e) => {
								setNewData({
									...newData,
									id: e.target.value,
								});
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
								setNewData({
									...newData,
									name: e.target.value,
								});
							}}
						/>
					</div>
				</div>
			</form>
		</EditContentRegular>
	);
};
