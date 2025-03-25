"use client";

import { useEffect, useState } from "react";
import { Member } from "@/utils/types/internal";
import { StatList } from "./StatList";
import { YearPicker } from "@/components/date/date-picker/year-picker/YearPicker";
import dayjs from "dayjs";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { EditIcon } from "@/components/icons/Icons";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import { getMembers, getMyInfo, MembersQK } from "@/utils/api/members";
import { MyInfo } from "@/app/settings/my-account/profile/Content";
import { Dropdown } from "@/components/input/dropdown/Dropdown";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_STAT,
	});

	const [member, setMember] = useState<Member>();
	const [memberOptions, setMemberOptions] = useState<Member[]>([]);
	const [year, setYear] = useState<dayjs.Dayjs>(dayjs());
	const jwt = useAuthStore((state) => state.jwt);

	const membersQuery = useQuery<Member[], AxiosError>({
		queryKey: [MembersQK.GET_MEMBERS],
		queryFn: async () => {
			const members = await getMembers(jwt);
			return members;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const myInfoQuery = useQuery<MyInfo, AxiosError>({
		queryKey: [MembersQK.GET_MY_INFO, jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
			return isSignedIn;
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

	return (
		<PageContainer>
			<PageBlock
				title="Stats"
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								{
									content: "Add a stat",
									hideMenuOnClick: true,
									icon: <EditIcon size={15} />,
									onClick: () => {
										setEdit({
											show: true,
											id: EditId.ADD_STAT,
										});
									},
								},
							]}
						/>
						{createPortal(
							<EditPanel edit={edit} setEdit={setEdit} />,
							document.body
						)}
					</>
				}
			>
				<div
					className="flex items-center px-6 py-4 gap-6
					text-sm
					rounded-md border-t-[1px] border-white/10"
				>
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
					<YearPicker date={year} setDate={setYear} />
				</div>
				<StatList member={member} year={year} />
			</PageBlock>
		</PageContainer>
	);
};
