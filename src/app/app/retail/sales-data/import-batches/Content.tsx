"use client";

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
	getPermissions,
	getRetailSalesDataImportBatches,
	RetailSalesDataQK,
} from "@/utils/api/app/retail/sales-data";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getRetailSocket } from "../../retail-socket";
import { HorizontalProgress } from "@/components/progress/horizontal-progress/HorizontalProgress";
import { Loading } from "@/components/page-authorization/Loading";
import { Exception } from "@/components/page-authorization/Exception";
import { Forbidden } from "@/components/page-authorization/Forbidden";

type Progress = {
	batchId: number;
	percentage: number;
};

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.RETAIL_IMPORT_SALES_DATA,
	});

	const [isConnected, setIsConnected] = useState(false);
	const [progresses, setProgresses] = useState<Progress[]>([]);

	useEffect(() => {
		const socket = getRetailSocket();

		socket.on("connect", () => {
			setIsConnected(true);
		});
		socket.on("disconnect", () => {
			setIsConnected(false);
		});

		socket.on("retail-sales-data-saving-progress", (newData: Progress) => {
			setProgresses((prevProgresses) => {
				/* exsisting progress */
				if (prevProgresses.some((p) => p.batchId === newData.batchId)) {
					if (newData.percentage === 100) {
						/* remove progress when 100% */
						const removed = prevProgresses.filter(
							(p) => p.batchId !== newData.batchId
						);
						queryClient.invalidateQueries({
							queryKey: [
								RetailSalesDataQK.GET_SALES_DATA_IMPORT_BATCHES,
							],
						});
						return removed;
					} else {
						/* update progress */
						return prevProgresses.map((p) =>
							p.batchId === newData.batchId
								? { ...p, percentage: newData.percentage }
								: p
						);
					}
				} else {
					/* new progress */
					return [...prevProgresses, newData];
				}
			});
		});

		/* cleanup on component unmount */
		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("retail-sales-data-saving-progress");
		};
	}, []);

	const jwt = useAuthStore((state) => state.jwt);

	const salesDataPermQuery = useQuery({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_PERMISSIONS],
		queryFn: async () => {
			const data = await getPermissions(jwt);
			return data;
		},
	});

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

	if (salesDataPermQuery.isPending) {
		return <Loading />;
	}

	if (salesDataPermQuery.isSuccess && salesDataPermQuery.data) {
		switch (salesDataPermQuery.data.actions["*"]) {
			case "EFFECT_DENY":
				return <Forbidden />;
			case "EFFECT_ALLOW":
				return (
					<PageContainer>
						<PageBlock
							title={"Import Batches"}
							moreMenu={
								<>
									<TitleMoreMenu
										items={[
											<TitleMoreMenuButton
												key={
													EditId.RETAIL_IMPORT_SALES_DATA
												}
												onClick={() => {
													setEdit({
														show: true,
														id: EditId.RETAIL_IMPORT_SALES_DATA,
													});
												}}
											>
												<EditIcon size={15} /> Import
												New Data
											</TitleMoreMenuButton>,
										]}
									/>
									{createPortal(
										<EditPanel
											edit={edit}
											setEdit={setEdit}
										/>,
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
									{importBatchesQuery.data?.map(
										(batch: any) => {
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
													<td>
														{progresses.some(
															(p) => {
																return (
																	p.batchId ===
																	batch.id
																);
															}
														) ? (
															<HorizontalProgress
																className="max-w-28"
																backgroundColor="bg-white/30"
																progress={
																	(
																		progresses.find(
																			(
																				p
																			) => {
																				return (
																					p.batchId ===
																					batch.id
																				);
																			}
																		) as Progress
																	).percentage
																}
															/>
														) : (
															batch._count
																.retailSalesData
														)}
													</td>
													<td>
														{dayjs(
															batch.createdAt
														).format(
															"MMM DD, YYYY HH:mm:ss"
														)}
													</td>
													<td>
														{progresses.some(
															(p) => {
																return (
																	p.batchId ===
																	batch.id
																);
															}
														) ? null : (
															<ConfirmDialogWithButton
																question={
																	"Are you sure you want to delete this batch?"
																}
																data={batch.id}
																onOk={(
																	batchId:
																		| number
																		| undefined
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
																	<DeleteIcon
																		size={
																			15
																		}
																	/>
																</div>
															</ConfirmDialogWithButton>
														)}
													</td>
												</tr>
											);
										}
									)}
								</Tbody>
							</Table>
						</PageBlock>
					</PageContainer>
				);
			default:
				return <Exception />;
		}
	} else {
		return <Exception />;
	}
};
