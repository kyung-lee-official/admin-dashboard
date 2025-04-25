"use client";

import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { ConfirmDialogWithButton } from "@/components/confirm-dialog/ConfirmDialogWithButton";
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
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import {
	deleteRetailSalesDataImportBatchById,
	getRetailSalesDataImportBatches,
	RetailSalesDataQK,
} from "@/utils/api/app/retail/sales-data";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
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
		retry: false,
		refetchOnWindowFocus: false,
	});

	const deleteBatchMutation = useMutation({
		mutationFn: async (batchId: number | undefined) => {
			await deleteRetailSalesDataImportBatchById(batchId as number, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [RetailSalesDataQK.GET_SALES_DATA_IMPORT_BATCHES],
			});
		},
	});

	return (
		<PageContainer>
			<PageBlock
				title={"Import Batches"}
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								<TitleMoreMenuButton
									key={EditId.RETAIL_IMPORT_SALES_DATA}
									onClick={() => {
										setEdit({
											show: true,
											id: EditId.RETAIL_IMPORT_SALES_DATA,
										});
									}}
								>
									<EditIcon size={15} /> Import New Data
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
				<Table>
					<Thead>
						<tr>
							<th>Batch Id</th>
							<th>Batch Size</th>
							<th>Imported At</th>
							<th className="w-12"></th>
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
									<td>
										<ConfirmDialogWithButton
											question={
												"Are you sure you want to delete this batch?"
											}
											data={batch.id}
											onOk={(
												batchId: number | undefined
											) => {
												deleteBatchMutation.mutate(
													batchId
												);
											}}
										>
											<div
												className={`flex items-center w-full px-2 py-1.5 gap-2
												hover:bg-white/5
												rounded cursor-pointer whitespace-nowrap`}
											>
												<DeleteIcon size={15} />
											</div>
										</ConfirmDialogWithButton>
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
