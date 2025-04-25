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
import {
	TitleMoreMenu,
	TitleMoreMenuButton,
} from "@/components/content/TitleMoreMenu";
import { EditIcon } from "@/components/icons/Icons";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import { getMeAndMembersOfMySubRoles, MembersQK } from "@/utils/api/members";
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

	return (
		<PageContainer>
			<PageBlock
				title="Stats"
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								<TitleMoreMenuButton
									key={EditId.ADD_STAT}
									onClick={() => {
										setEdit({
											show: true,
											id: EditId.ADD_STAT,
										});
									}}
								>
									<EditIcon size={15} /> Add a stat
								</TitleMoreMenuButton>,
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
