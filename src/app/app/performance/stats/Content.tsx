"use client";

import { useState } from "react";
import { Member } from "@/utils/types/internal";
import { StatList } from "./StatList";
import { YearPicker } from "@/components/date/date-picker/year-picker/YearPicker";
import dayjs from "dayjs";
import { TitleMoreMenuItems } from "./moreMenu/TitleMoreMenuItems";
import { MemberSelector } from "@/components/input/selectors/MemberSelector";

export const Content = () => {
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
					<TitleMoreMenuItems />
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
