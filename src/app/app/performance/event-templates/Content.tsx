"use client";

import { useState } from "react";
import { MemberRole } from "@/utils/types/internal";
import { RoleSelector } from "../../../../components/input/selectors/RoleSelector";
import { TitleMoreMenuItems } from "./moreMenu/TitleMoreMenuItems";
import { TemplateList } from "./TemplateList";

export const Content = () => {
	const [role, setRole] = useState<MemberRole>();

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Events Template</div>
					<TitleMoreMenuItems />
				</div>
				<div
					className="flex items-center px-6 py-4 gap-6
					text-sm
					rounded-md border-t-[1px] border-white/10"
				>
					<RoleSelector role={role} setRole={setRole} />
				</div>
				<TemplateList role={role} />
			</div>
		</div>
	);
};
