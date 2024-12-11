"use client";

import { MemberSelector } from "../events/MemberSelector";
import { useState } from "react";
import { Member } from "@/utils/types/internal";
import { YearPicker } from "@/components/date/date-picker/year-picker/YearPicker";
import dayjs from "dayjs";

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
					<div className="text-lg font-semibold">Events</div>
					{/* <TitleMoreMenu /> */}
				</div>
				<div
					className="flex items-center px-6 py-4 gap-6
					text-sm
					rounded-md border-t-[1px] border-white/10"
				>
					<MemberSelector member={member} setMember={setMember} />
					<YearPicker date={year} setDate={setYear} />
				</div>
			</div>
		</div>
	);
};
