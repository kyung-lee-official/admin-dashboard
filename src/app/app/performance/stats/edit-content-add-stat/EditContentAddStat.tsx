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

export const EditContentAddStat = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.ADD_STAT;
	const title = "Add Stat";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const curr = dayjs();

	const oldData: CreatePerformanceStatData = useMemo(
		() => ({
			ownerId: "",
			month: curr.toDate(),
			statSections: [
				{
					weight: 100,
					title: "New Section",
					description: "",
				},
			],
		}),
		[]
	);
	const [newData, setNewData] = useState<CreatePerformanceStatData>(oldData);

	const mutation = useMutation({
		mutationFn: () => {
			return createStat(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_PERFORMANCE_STATS],
			});
			setEdit({ show: false, id: editId });
		},
		onError: () => {},
	});

	function onSave() {
		mutation.mutate();
	}

	const [member, setMember] = useState<Member>();
	const [month, setMonth] = useState<dayjs.Dayjs>(curr);
	const [sections, setSections] = useState<CreateSectionData[]>(
		newData.statSections
	);
	useEffect(() => {
		setNewData({
			ownerId: member?.id ?? "",
			month: month.toDate(),
			statSections: sections,
		});
	}, [member, month, sections]);

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
			<form className="flex-[1_0_100px] flex flex-col">
				<div className="flex-[1_0_100px] flex flex-col px-6 py-4 gap-6">
					<div
						className="flex flex-col gap-1.5
						text-sm"
					>
						Member
						<MemberSelector member={member} setMember={setMember} />
					</div>
					<div
						className="flex flex-col gap-1.5
						text-sm"
					>
						Month
						<MonthPicker date={month} setDate={setMonth} />
					</div>
					<div
						className="flex flex-col gap-1.5
						text-sm"
					>
						<Sections
							sections={sections}
							setSections={setSections}
						/>
					</div>
				</div>
			</form>
		</EditContentRegular>
	);
};
