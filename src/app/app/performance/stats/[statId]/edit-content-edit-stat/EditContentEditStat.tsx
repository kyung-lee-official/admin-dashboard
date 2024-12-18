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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Sections } from "./Sections";
import {
	EditPerformanceStatData,
	PerformanceStatResponse,
} from "@/utils/types/app/performance";
import { AxiosError } from "axios";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { nanoid } from "nanoid";

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
		queryKey: [PerformanceQK.GET_PERFORMANCE_STAT_BY_ID, statId, jwt],
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
	const [statSections, setStatSections] = useState(oldData.statSections);

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
						title: s.title,
					};
				}),
			};
			setOldData(initialData);
			setNewData(initialData);
			setStatSections(initialData.statSections);
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
				queryKey: [PerformanceQK.GET_PERFORMANCE_STAT_BY_ID],
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
			<div
				className="flex flex-col h-[calc(100svh-18px-61px)] overflow-y-auto
				scrollbar"
			>
				<form className="flex-[1_0_100px] flex flex-col">
					<div
						className="flex flex-col px-6 py-4 gap-6
						border-b-[1px] border-white/10"
					>
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
								newData={newData}
								setNewData={setNewData}
							/>
						</div>
					</div>
				</form>
			</div>
		</EditContentRegular>
	);
};
