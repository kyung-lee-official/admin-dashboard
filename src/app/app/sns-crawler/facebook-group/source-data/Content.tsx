"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";
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
		<PageContainer>
			<PageBlock
				title="Source Data"
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								{
									content: "Overwrite Source Data",
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
					</>
				}
			>
				{getFacebookSourceDataQuery.data && (
					<Table>
						<Thead>
							<tr>
								<th className="w-[10%]">Excel Row</th>
								<th className="w-[50%]">Group Address</th>
								<th className="w-[50%]">Group Name</th>
							</tr>
						</Thead>
						<Tbody>
							{getFacebookSourceDataQuery.data &&
								[...getFacebookSourceDataQuery.data].map(
									(s, i) => {
										return (
											<tr key={i}>
												<td className="w-[10%]">
													{s.excelRow}
												</td>
												<td className="w-[50%]">
													{s.groupAddress}
												</td>
												<td className="w-[50%]">
													{s.groupName}
												</td>
											</tr>
										);
									}
								)}
						</Tbody>
					</Table>
				)}
			</PageBlock>
		</PageContainer>
	);
};
