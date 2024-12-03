"use client";

import { MemberSelector } from "../events/MemberSelector";
import { useState } from "react";
import { Member } from "@/app/settings/general/roles/edit-content-edit-role.tsx/EditContentEditRole";

export const Content = () => {
	const [member, setMember] = useState<Member>();

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				rounded-md border-[1px] border-white/10 border-t-white/15"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Stats</div>
				</div>
				<div
					className="flex items-center px-6 py-4 gap-6
					text-sm
					rounded-md border-t-[1px] border-white/10"
				>
					<MemberSelector member={member} setMember={setMember} />
				</div>
			</div>
		</div>
	);
};
