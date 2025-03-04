import { useAuthStore } from "@/stores/auth";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/utils/react-query/react-query";
import { Input } from "@/components/input/Input";
import {
	addYouTubeToken,
	SnsYouTubeDataQK,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";

export const EditContentAddYouTubeToken = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.ADD_YOUTUBE_TOKEN;
	const title = "Add YouTube Token";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const [oldData, setOldData] = useState<string>("");
	const [newData, setNewData] = useState(oldData);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNewData(e.target.value);
	};

	const mutation = useMutation({
		mutationFn: async () => {
			return await addYouTubeToken(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TOKENS],
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
					Add YouTube Token:
					<Input onChange={onChange} type="text" isError={false} />
				</div>
			</form>
		</EditContentRegular>
	);
};
