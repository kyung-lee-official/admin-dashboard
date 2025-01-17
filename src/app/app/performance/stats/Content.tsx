"use client";

import { useState } from "react";
import { Member } from "@/utils/types/internal";
import { StatList } from "./StatList";
import { YearPicker } from "@/components/date/date-picker/year-picker/YearPicker";
import dayjs from "dayjs";
import { MemberSelector } from "@/components/input/selectors/MemberSelector";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { EditIcon } from "@/components/icons/Icons";
import { createPortal } from "react-dom";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_STAT,
	});

	const [member, setMember] = useState<Member>();
	const [year, setYear] = useState<dayjs.Dayjs>(dayjs());

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Stats</div>
					<TitleMoreMenu
						items={[
							{
								text: "Add a stat",
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
				</div>
				<div
					className="flex items-center px-6 py-4 gap-6
					text-sm
					rounded-md border-t-[1px] border-white/10"
				>
					<MemberSelector member={member} setMember={setMember} />
					<YearPicker date={year} setDate={setYear} />
				</div>
				<StatList member={member} year={year} />
			</div>
		</div>
	);
};
