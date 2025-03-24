import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { useAuthStore } from "@/stores/auth";
import {
	getStatById,
	PerformanceQK,
	updateStat,
} from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
	Dispatch,
	SetStateAction,
	useEffect,
	useReducer,
	useState,
} from "react";
import { Sections } from "./Sections";
import {
	EditPerformanceStatData,
	PerformanceStatResponse,
} from "@/utils/types/app/performance";
import { AxiosError } from "axios";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { nanoid } from "nanoid";
import { EditSectionType, statSectionsReducer } from "./Reducers";

export const EditContentEditStat = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.EDIT_STAT;
	const title = "Edit Stat";
	const { edit, setEdit } = props;
	const { statId } = edit.auxData;

	const jwt = useAuthStore((state) => state.jwt);

	const statsQuery = useQuery<PerformanceStatResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_STAT_BY_ID],
		queryFn: async () => {
			const stats = await getStatById(statId, jwt);
			return stats;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [oldData, setOldData] = useState<EditPerformanceStatData>({
		ownerId: "",
		month: dayjs(),
		statSections: [],
	});
	const [newData, setNewData] = useState<EditPerformanceStatData>(oldData);
	const [statSections, dispatchStatSections] = useReducer(
		statSectionsReducer,
		oldData.statSections
	);

	useEffect(() => {
		if (statsQuery.data) {
			const initialData = {
				ownerId: statsQuery.data.ownerId,
				month: dayjs(statsQuery.data.month),
				statSections: statsQuery.data.statSections.map((s) => {
					return {
						id: s.id,
						tempId: nanoid(),
						weight: s.weight,
						memberRoleId: s.memberRoleId,
						title: s.title,
						description: s.description,
						createdAt: s.createdAt,
					};
				}),
			};
			setOldData(initialData);
			setNewData(initialData);
			dispatchStatSections({
				type: EditSectionType.INITIALIZE,
				payload: initialData.statSections,
			});
		}
	}, [statsQuery.data]);

	useEffect(() => {
		setNewData({
			ownerId: oldData.ownerId,
			month: oldData.month,
			statSections,
		});
	}, [statSections]);

	const mutation = useMutation({
		mutationFn: () => {
			return updateStat(statId, newData, jwt);
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
			<form className="flex flex-col">
				<div className="flex flex-col px-6 py-4 gap-6">
					<div
						className="flex flex-col gap-1.5
						text-sm"
					>
						{dayjs(statsQuery.data?.month).format("MMMM YYYY")}
					</div>
					<div
						className="flex flex-col gap-1.5
						text-sm"
					>
						<Sections
							statSections={statSections}
							dispatchStatSections={dispatchStatSections}
						/>
					</div>
				</div>
			</form>
		</EditContentRegular>
	);
};
