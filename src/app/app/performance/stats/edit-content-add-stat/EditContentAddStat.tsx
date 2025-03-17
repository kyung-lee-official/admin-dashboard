import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { useAuthStore } from "@/stores/auth";
import { createStat, PerformanceQK } from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MonthPicker } from "@/components/date/date-picker/month-picker/MonthPicker";
import { Member } from "@/utils/types/internal";
import { Sections } from "./Sections";
import {
	CreatePerformanceStatData,
	CreateSectionData,
} from "@/utils/types/app/performance";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import { nanoid } from "nanoid";
import { Dropdown } from "@/components/input/dropdown-old/Dropdown";
import { MyInfo } from "@/app/settings/my-account/profile/Content";
import { AxiosError } from "axios";
import { getMembers, getMyInfo, MembersQK } from "@/utils/api/members";

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
	const [member, setMember] = useState<Member | undefined>(undefined);
	const [memberOptions, setMemberOptions] = useState<Member[]>([]);
	const [month, setMonth] = useState<dayjs.Dayjs>(oldData.month);
	const [statSections, setStatSections] = useState<CreateSectionData[]>(
		oldData.statSections
	);

	const myInfoQuery = useQuery<MyInfo, AxiosError>({
		queryKey: [MembersQK.GET_MY_INFO, jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const membersQuery = useQuery<Member[], AxiosError>({
		queryKey: [MembersQK.GET_MEMBERS],
		queryFn: async () => {
			const members = await getMembers(jwt);
			return members;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (membersQuery.data && myInfoQuery.data) {
			const myRoles = myInfoQuery.data.memberRoles;
			const iAmAdmin = myRoles.some((role) => role.id === "admin");
			if (!iAmAdmin) {
				setMemberOptions([myInfoQuery.data]);
			} else {
				setMemberOptions(membersQuery.data);
			}
		}
	}, [membersQuery.data, myInfoQuery.data]);

	useEffect(() => {
		setNewData({
			member: member,
			month: month,
			statSections: statSections,
		});
	}, [member, month, statSections]);

	const mutation = useMutation({
		mutationFn: () => {
			const dto = {
				ownerId: newData.member?.id,
				month: newData.month.startOf("month").format("YYYY-MM-DD"),
				statSections: newData.statSections.map((s) => ({
					weight: s.weight,
					title: s.title,
					description: s.description,
				})),
			};
			return createStat(dto, jwt);
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
