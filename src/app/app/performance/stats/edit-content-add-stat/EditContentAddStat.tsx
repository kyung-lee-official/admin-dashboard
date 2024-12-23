import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { useAuthStore } from "@/stores/auth";
import { createStat, PerformanceQK } from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { MemberSelector } from "@/components/input/selectors/MemberSelector";
import { MonthPicker } from "@/components/date/date-picker/month-picker/MonthPicker";
import { Member } from "@/utils/types/internal";
import { Sections } from "./Sections";
import {
	CreatePerformanceStatData,
	CreateSectionData,
} from "@/utils/types/app/performance";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { nanoid } from "nanoid";

export const EditContentAddStat = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.ADD_STAT;
	const title = "Add Stat";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const [oldData, setOldData] = useState<CreatePerformanceStatData>({
		member: {
			id: "",
			email: "",
			name: "",
		},
		month: dayjs(),
		statSections: [
			{
				tempId: nanoid(),
				weight: 100,
				title: "New Section",
				description: "",
			},
		],
	});
	const [newData, setNewData] = useState<CreatePerformanceStatData>(oldData);
	const [member, setMember] = useState<Member>(oldData.member);
	const [month, setMonth] = useState<dayjs.Dayjs>(oldData.month);
	const [statSections, setStatSections] = useState<CreateSectionData[]>(
		oldData.statSections
	);

	useEffect(() => {
		setNewData({
			member: member,
			month: month,
			statSections: statSections,
		});
	}, [member, month, statSections]);

	const mutation = useMutation({
		mutationFn: () => {
			return createStat(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_STATS],
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
			<form className="px-6 py-4 h-full">
				<div
					className="mb-6
					text-sm"
				>
					<div className="mb-1.5">Member</div>
					<MemberSelector member={member} setMember={setMember} />
				</div>
				<div
					className="mb-6
					text-sm"
				>
					<div className="mb-1.5">Month</div>
					<MonthPicker date={month} setDate={setMonth} />
				</div>
				<div className="text-sm">
					<Sections
						sections={statSections}
						setSections={setStatSections}
					/>
				</div>
			</form>
		</EditContentRegular>
	);
};
