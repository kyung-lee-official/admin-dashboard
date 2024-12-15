import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { EditProps } from "../../../../components/edit-panel/EditPanel";
import { createRole, RolesQK } from "@/utils/api/roles";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";

export const EditContentAddRole = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = "add-role";
	const title = "Add Role";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const mutation = useMutation({
		mutationFn: () => {
			return createRole(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [RolesQK.GET_ROLES_BY_IDS, jwt],
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
						Role Id
						<input
							type="text"
							className="px-2 py-1.5
							bg-white/10
							rounded-md outline-none
							border-[1px] border-white/10"
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
						Name
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
					{/* <div
						className="flex flex-col gap-1.5
						text-sm"
					>
						Members
						<CheckboxList
							allOptions={newData.members}
							newSelectedOptions={newData.members}
							setNewSelectedOptions={newData.members}
							itemKey="name"
						/>
					</div> */}
				</div>
			</form>
		</EditContentRegular>
	);
};
