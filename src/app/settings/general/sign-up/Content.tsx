"use client";

import { EditIcon } from "@/components/icons/Icons";
import { useState } from "react";
import {
	EditPanel,
	EditProps,
} from "../../../../components/edit-panel/EditPanel";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { getPermissions, ServerSettingQK } from "@/utils/api/server-settings";
import { useAuthStore } from "@/stores/auth";
import { Forbidden } from "@/components/page-authorization/Forbidden";
import { Loading } from "@/components/page-authorization/Loading";
import { Exception } from "@/components/page-authorization/Exception";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({ show: false, id: "" });
	const jwt = useAuthStore((state) => state.jwt);

	const serverPermQuery = useQuery({
		queryKey: [ServerSettingQK.GET_MY_SERVER_PERMISSIONS],
		queryFn: async () => {
			const data = await getPermissions(jwt);
			return data;
		},
	});

	if (serverPermQuery.isPending) {
		return <Loading />;
	}

	if (serverPermQuery.isSuccess) {
		switch (serverPermQuery.data.actions["*"]) {
			case "EFFECT_DENY":
				return <Forbidden />;
			case "EFFECT_ALLOW":
				return (
					<div className="w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 gap-y-3">
						<div
							className="text-white/90
							bg-white/5
							rounded-md border-[1px] border-white/10 border-t-white/15"
						>
							<div className="flex justify-between items-center px-6 py-4">
								<div className="text-lg font-semibold">
									Sign Up
								</div>
								<button
									className="flex justify-center items-center w-7 h-7
									text-white/50
									hover:bg-white/10 rounded-md"
									onClick={() => {
										setEdit({ show: true, id: "sign-up" });
									}}
								>
									<EditIcon size={15} />
								</button>
							</div>
						</div>
						{createPortal(
							<EditPanel edit={edit} setEdit={setEdit} />,
							document.body
						)}
					</div>
				);
			default:
				return <Exception />;
		}
	} else {
		return <Exception />;
	}
};
