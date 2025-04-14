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
	getRetailSalesDataImportBatches,
	RetailSalesDataQK,
} from "@/utils/api/app/retail/sales-data";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { createPortal } from "react-dom";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.RETAIL_IMPORT_SALES_DATA,
	});

	const jwt = useAuthStore((state) => state.jwt);
	const importBatchesQuery = useQuery<any, AxiosError>({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_IMPORT_BATCHES],
		queryFn: async () => {
			const feedbacks = await getRetailSalesDataImportBatches(1, jwt);
			return feedbacks;
		},
		enabled: true,
		retry: false,
		refetchOnWindowFocus: false,
	});

	return (
		<PageContainer>
			<PageBlock
				title={"Import Batches"}
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								{
									content: "Import New Data",
									hideMenuOnClick: true,
									icon: <EditIcon size={15} />,
									onClick: () => {
										setEdit({
											show: true,
											id: EditId.RETAIL_IMPORT_SALES_DATA,
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
				<Table>
					<Thead>
						<tr>
							<th>Batch Id</th>
							<th>Batch Size</th>
							<th>Imported At</th>
						</tr>
					</Thead>
					<Tbody>
						{importBatchesQuery.data?.map((batch: any) => {
							return (
								<tr
									className="cursor-pointer"
									key={batch.id}
									onClick={() => {
										// redirect(
										// 	`/app/retail/sales-data/import-batches/${batch.id}`
										// );
									}}
								>
									<td>{batch.id}</td>
									<td>{batch._count.retailSalesData}</td>
									<td>
										{dayjs(batch.createdAt).format(
											"MMM DD, YYYY HH:mm:ss"
										)}
									</td>
								</tr>
							);
						})}
					</Tbody>
				</Table>
			</PageBlock>
		</PageContainer>
	);
};
