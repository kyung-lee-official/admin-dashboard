import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { useAuthStore } from "@/stores/auth";
import {
	getSectionById,
	PerformanceQK,
	updateSectionById,
} from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
	EditSectionData,
	SectionResponse,
} from "@/utils/types/app/performance";
import { AxiosError } from "axios";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import {
	EditContentRegularForm,
	EditContentRegularFormBlock,
} from "@/components/edit-panel/EditContentRegularForm";
import { IntegerInput } from "@/components/input/integer-input/IntegerInput";

export const EditContentEditSection = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.EDIT_SECTION;
	const panelTitle = "Edit Section";
	const { edit, setEdit } = props;
	const { sectionId } = edit.auxData;

	const [oldData, setOldData] = useState<EditSectionData>({
		weight: 0,
		title: "",
		description: "",
	});
	const [newData, setNewData] = useState<EditSectionData>(oldData);
	const [weight, setWeight] = useState(oldData.weight);
	const [title, setTitle] = useState(oldData.title);
	const [description, setDescription] = useState(oldData.description);

	const jwt = useAuthStore((state) => state.jwt);

	const sectionQuery = useQuery<SectionResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_SECTION_BY_ID],
		queryFn: async () => {
			const section = await getSectionById(sectionId, jwt);
			return section;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	/* for initializing data */
	useEffect(() => {
		if (sectionQuery.data) {			
			const initialData = {
				weight: sectionQuery.data.weight,
				title: sectionQuery.data.title,
				description: sectionQuery.data.description,
			};
			setOldData(initialData);
			setNewData(initialData);
			setWeight(initialData.weight);
			setTitle(initialData.title);
			setDescription(initialData.description);
		}
	}, [sectionQuery.data]);

	/* for updating data */
	useEffect(() => {
		setNewData({
			weight: weight,
			title: title,
			description: description,
		});
	}, [weight, title, description]);

	const mutation = useMutation({
		mutationFn: () => {
			const dto = {
				sectionId: sectionId,
				weight: newData.weight,
				title: newData.title,
				description: newData.description,
			};
			return updateSectionById(dto, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_SECTION_BY_ID],
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
			title={panelTitle}
			editId={editId}
			edit={edit}
			setEdit={setEdit}
			onSave={onSave}
			newData={newData}
			oldData={oldData}
		>
			<EditContentRegularForm>
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
				<EditContentRegularFormBlock title="Title">
					<input
						type="text"
						className="w-40 px-2 py-0.5
						border-[1px] border-neutral-700 border-t-neutral-600
						rounded"
						placeholder="Title"
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
						}}
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
