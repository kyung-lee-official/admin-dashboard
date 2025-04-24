"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";
import {
	TitleMoreMenu,
	TitleMoreMenuButton,
} from "@/components/content/TitleMoreMenu";
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
		<PageContainer>
			<PageBlock
				title="Source Data"
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								<TitleMoreMenuButton
									onClick={() => {
										setEdit({
											show: true,
											id: EditId.OVERWRITE_YOUTUBE_SOURCE_DATA,
										});
									}}
								>
									<EditIcon size={15} /> Overwrite Source Data
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
				{getYouTubeSourceDataQuery.data && (
					<Table>
						<Thead>
							<tr>
								<th className="w-1/2">Excel Row</th>
								<th className="w-1/2">Keyword</th>
							</tr>
						</Thead>
						<Tbody>
							{getYouTubeSourceDataQuery.data.map((s, i) => {
								return (
									<tr key={i}>
										<td className="w-1/2">{s.excelRow}</td>
										<td className="w-1/2">{s.keyword}</td>
									</tr>
								);
							})}
						</Tbody>
					</Table>
				)}
			</PageBlock>
		</PageContainer>
	);
};
