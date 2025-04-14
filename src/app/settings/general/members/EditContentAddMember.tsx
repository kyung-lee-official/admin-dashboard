import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { Input } from "@/components/input/Input";
import { useAuthStore } from "@/stores/auth";
import { createMember, MembersQK } from "@/utils/api/members";
import { queryClient } from "@/utils/react-query/react-query";
import { CreateMemberDto } from "@/utils/types/internal";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const EditContentAddMember = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.ADD_MEMBER;
	const title = "Add Member";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);
	const oldData: CreateMemberDto = {
		name: "",
		email: "",
	};
	const [newData, setNewData] = useState(oldData);
	const [name, setName] = useState(oldData.name);
	const [email, setEmail] = useState(oldData.email);
	const mutation = useMutation({
		mutationFn: () => {
			return createMember(
				{
					name: newData.name,
					email: newData.email,
				},
				jwt
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [MembersQK.GET_MEMBERS],
			});
			setEdit({ show: false, id: editId });
		},
		onError: () => {},
	});

	useEffect(() => {
		setNewData({
			name: name,
			email: email,
		});
	}, [name, email]);

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
			<form className="flex flex-col px-6 py-4 gap-6">
				<div
					className="flex flex-col gap-1.5
					text-sm"
				>
					Name:
					<Input
						onChange={(e) => {
							setName(e.target.value);
						}}
						type="text"
						isError={false}
					/>
				</div>
				<div
					className="flex flex-col gap-1.5
					text-sm"
				>
					Email:
					<Input
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						type="text"
						isError={false}
					/>
				</div>
			</form>
		</EditContentRegular>
	);
};
