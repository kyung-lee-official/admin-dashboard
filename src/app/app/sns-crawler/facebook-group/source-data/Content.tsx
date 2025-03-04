"use client";

import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { EditIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import {
	getFacebookGroupSourceData,
	SnsFacebookCrawlerQK,
} from "@/utils/api/app/sns-crawler/facebook-group-crawler";
import { FacebookGroupOverwriteSourceDto } from "@/utils/types/app/sns-crawler";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.OVERWRITE_FACEBOOK_GROUP_SOURCE_DATA,
	});

	const jwt = useAuthStore((state) => state.jwt);
	const getFacebookSourceDataQuery = useQuery<
		FacebookGroupOverwriteSourceDto,
		AxiosError
	>({
		queryKey: [SnsFacebookCrawlerQK.GET_FACEBOOK_GROUP_SOURCE_DATA],
		queryFn: async () => {
			const facebookGroupSourceData = await getFacebookGroupSourceData(
				jwt
			);
			return facebookGroupSourceData;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Source Data</div>
					<TitleMoreMenu
						items={[
							{
								text: "Overwrite Source Data",
								hideMenuOnClick: true,
								icon: <EditIcon size={15} />,
								onClick: () => {
									setEdit({
										show: true,
										id: EditId.OVERWRITE_FACEBOOK_GROUP_SOURCE_DATA,
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
				{getFacebookSourceDataQuery.data && (
					<table
						className="w-full
						text-sm text-white/50"
					>
						<tbody className="[&_>_tr_>_td]:px-2 [&_>_tr_>_td]:py-1">
							{getFacebookSourceDataQuery.data.map((s, i) => {
								return (
									<tr
										key={i}
										className="flex items-center px-3 py-1 gap-6
										text-sm
										hover:bg-white/5
										border-t-[1px] border-white/10"
									>
										<td className="w-1/2">
											{s.groupAddress}
										</td>
										<td className="w-1/2">{s.groupName}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};
