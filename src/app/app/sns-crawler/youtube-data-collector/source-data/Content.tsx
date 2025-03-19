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
	getYouTubeGroupSourceData,
	SnsYouTubeDataQK,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";
import { YoutubeDataOverwriteSourceDto } from "@/utils/types/app/sns-crawler";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.OVERWRITE_YOUTUBE_SOURCE_DATA,
	});

	const jwt = useAuthStore((state) => state.jwt);
	const getYouTubeSourceDataQuery = useQuery<
		YoutubeDataOverwriteSourceDto,
		AxiosError
	>({
		queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_SOURCE_DATA],
		queryFn: async () => {
			const youtubeGroupSourceData = await getYouTubeGroupSourceData(jwt);
			return youtubeGroupSourceData;
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
								content: "Overwrite Source Data",
								hideMenuOnClick: true,
								icon: <EditIcon size={15} />,
								onClick: () => {
									setEdit({
										show: true,
										id: EditId.OVERWRITE_YOUTUBE_SOURCE_DATA,
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
				{getYouTubeSourceDataQuery.data && (
					<table
						className="w-full
						text-sm text-white/50"
					>
						<thead className="[&_>_tr_>th]:px-2 [&_>_tr_>th]:py-1">
							<tr className="text-left">
								<th className="w-1/2">Excel Row</th>
								<th className="w-1/2">Keyword</th>
							</tr>
						</thead>
						<tbody className="[&_>_tr_>_td]:px-2 [&_>_tr_>_td]:py-1">
							{getYouTubeSourceDataQuery.data.map((s, i) => {
								return (
									<tr
										key={i}
										className="px-3 py-1
										text-sm
										hover:bg-white/5
										border-t-[1px] border-white/10"
									>
										<td className="w-1/2">{s.excelRow}</td>
										<td className="w-1/2">{s.keyword}</td>
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
