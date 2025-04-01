import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { useAuthStore } from "@/stores/auth";
import { createStat, PerformanceQK } from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MonthPicker } from "@/components/date/date-picker/month-picker/MonthPicker";
import { Member } from "@/utils/types/internal";
import { CreatePerformanceStatData } from "@/utils/types/app/performance";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { AxiosError } from "axios";
import { getMeAndMembersOfMySubRoles, MembersQK } from "@/utils/api/members";
import { Dropdown } from "@/components/input/dropdown/Dropdown";
import {
	EditContentRegularForm,
	EditContentRegularFormBlock,
} from "@/components/edit-panel/EditContentRegularForm";

export const EditContentAddStat = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.ADD_STAT;
	const title = "Add Stat";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const [oldData, setOldData] = useState<CreatePerformanceStatData>({
		member: undefined,
		month: dayjs(),
	});
	const [newData, setNewData] = useState<CreatePerformanceStatData>(oldData);
	const [member, setMember] = useState<Member | undefined>(undefined);
	const [memberOptions, setMemberOptions] = useState<Member[]>([]);
	const [month, setMonth] = useState<dayjs.Dayjs>(oldData.month);

	const meAndMembersOfMySubRolesQuery = useQuery<Member[], AxiosError>({
		queryKey: [MembersQK.GET_ME_AND_MEMBERS_OF_MY_SUBROLES],
		queryFn: async () => {
			const members = await getMeAndMembersOfMySubRoles(jwt);
			return members;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (meAndMembersOfMySubRolesQuery.data) {
			setMemberOptions(meAndMembersOfMySubRolesQuery.data);
		}
	}, [meAndMembersOfMySubRolesQuery.data]);

	useEffect(() => {
		setNewData({
			member: member,
			month: month,
		});
	}, [member, month]);

	const mutation = useMutation({
		mutationFn: () => {
			const dto = {
				ownerId: newData.member?.id,
				month: newData.month.startOf("month").format("YYYY-MM-DD"),
			};
			return createStat(dto, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.SEARCH_STATS],
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
			<EditContentRegularForm>
				<EditContentRegularFormBlock title="Member">
					<Dropdown
						kind="object"
						mode="search"
						selected={member}
						setSelected={setMember}
						options={memberOptions ?? []}
						placeholder="Select a member"
						label={{ primaryKey: "name", secondaryKey: "email" }}
						sortBy="name"
					/>
				</EditContentRegularFormBlock>
				<EditContentRegularFormBlock title="Month">
					<MonthPicker date={month} setDate={setMonth} />
				</EditContentRegularFormBlock>
			</EditContentRegularForm>
		</EditContentRegular>
	);
};
