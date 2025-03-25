"use client";

import { EditIcon } from "@/components/icons/Icons";
import { useState } from "react";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { getPermissions, ServerSettingQK } from "@/utils/api/server-settings";
import { useAuthStore } from "@/stores/auth";
import { Forbidden } from "@/components/page-authorization/Forbidden";
import { Loading } from "@/components/page-authorization/Loading";
import { Exception } from "@/components/page-authorization/Exception";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.SIGN_UP,
	});
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
					<PageContainer>
						<PageBlock
							title="Sign Up"
							moreMenu={
								<>
									<button
										className="flex justify-center items-center w-7 h-7
									text-white/50
									hover:bg-white/10 rounded-md"
										onClick={() => {
											setEdit({
												show: true,
												id: EditId.SIGN_UP,
											});
										}}
									>
										<EditIcon size={15} />
									</button>
									{createPortal(
										<EditPanel
											edit={edit}
											setEdit={setEdit}
										/>,
										document.body
									)}
								</>
							}
						></PageBlock>
					</PageContainer>
				);
			default:
				return <Exception />;
		}
	} else {
		return <Exception />;
	}
};
