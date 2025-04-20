"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import {
	DateRange,
	DateRangePicker,
} from "@/components/date/date-range-picker/DateRangePicker";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { Dropdown as OnlineDropdown } from "@/components/input/online-dropdown/Dropdown";
import { useAuthStore } from "@/stores/auth";
import {
	getRetailSalesDataCategories,
	getRetailSalesDataClients,
	getRetailSalesDataSearchSku,
	getRetailSalesDataStorehouses,
	RetailSalesDataQK,
} from "@/utils/api/app/retail/sales-data";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useReducer, useState } from "react";
import { kanbanFilterReducer, Sku } from "./kanbanFilterReducer";

const TagContainer = (props: any) => {
	const { children } = props;
	return (
		<div
			className="flex flex-wrap px-6 py-3 gap-1.5
			border-t border-neutral-700"
		>
			{children}
		</div>
	);
};

const TagButton = (props: any) => {
	const { children, selected, onClick } = props;
	return (
		<button
			onClick={onClick}
			className={`px-1
			text-sm
			${selected && "text-neutral-300 bg-neutral-600"}
			border border-neutral-700
			rounded cursor-pointer`}
		>
			{children}
		</button>
	);
};

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.RETAIL_IMPORT_SALES_DATA,
	});

	const [kanbanFilter, dispatchKanbanFilter] = useReducer(
		kanbanFilterReducer,
		{
			dateMode: "range",
			dateRange: {
				start: dayjs().subtract(1, "month"),
				end: dayjs(),
			},
			clients: [],
			storehouses: [],
			categories: [],
			skus: [],
		}
	);

	const jwt = useAuthStore((state) => state.jwt);
	const getRetailSalesDataClientsQuery = useQuery<any, AxiosError>({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_CLIENTS],
		queryFn: async () => {
			const clients = await getRetailSalesDataClients(jwt);
			return clients;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});
	const getRetailSalesDataStorehousesQuery = useQuery<any, AxiosError>({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_STOREHOUSES],
		queryFn: async () => {
			const storehouses = await getRetailSalesDataStorehouses(jwt);
			return storehouses;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});
	const getRetailSalesDataCategoriesQuery = useQuery<any, AxiosError>({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_CATEGORIES],
		queryFn: async () => {
			const categories = await getRetailSalesDataCategories(jwt);
			return categories;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	async function handleSearchSku(term: string) {
		const sku = await getRetailSalesDataSearchSku(term, jwt);
		return sku;
	}
	/* function to handle deselection of an sku */
	const handleDeselect = (option: Sku) => {
		if (kanbanFilter.skus) {
			dispatchKanbanFilter({
				type: "SET_SKUS",
				payload: (kanbanFilter.skus as Sku[]).filter(
					(s: Sku) => s.id !== option.id
				),
			});
		}
	};

	return (
		<PageContainer>
			<PageBlock title={"Kanban"}>
				<TagContainer>
					{kanbanFilter.dateMode === "range" && (
						<DateRangePicker
							range={kanbanFilter.dateRange}
							setRange={() => {
								dispatchKanbanFilter({
									type: "SET_DATE_RANGE",
									payload: {
										start: dayjs().subtract(1, "month"),
										end: dayjs(),
									},
								});
							}}
						/>
					)}
				</TagContainer>
			</PageBlock>
			<PageBlock title={"Clients"}>
				<TagContainer>
					{getRetailSalesDataClientsQuery.data &&
						getRetailSalesDataClientsQuery.data.map((c: any) => {
							return (
								<TagButton
									key={c.id}
									selected={kanbanFilter.clients.includes(
										c.client
									)}
									onClick={() => {
										dispatchKanbanFilter({
											type: "SET_CLIENTS",
											payload:
												kanbanFilter.clients.includes(
													c.client
												)
													? (
															kanbanFilter.clients as string[]
													  ).filter(
															(client) =>
																client !==
																c.client
													  )
													: [
															...(kanbanFilter.clients as string[]),
															c.client,
													  ],
										});
									}}
								>
									{c.client}
								</TagButton>
							);
						})}
				</TagContainer>
			</PageBlock>
			<PageBlock title={"Storehouses"}>
				<TagContainer>
					{getRetailSalesDataStorehousesQuery.data &&
						getRetailSalesDataStorehousesQuery.data.map(
							(s: any) => {
								return (
									<TagButton
										key={s.id}
										selected={kanbanFilter.storehouses.includes(
											s.storehouse
										)}
										onClick={() => {
											dispatchKanbanFilter({
												type: "SET_STOREHOUSES",
												payload:
													kanbanFilter.storehouses.includes(
														s.storehouse
													)
														? (
																kanbanFilter.storehouses as string[]
														  ).filter(
																(storehouse) =>
																	storehouse !==
																	s.storehouse
														  )
														: [
																...(kanbanFilter.storehouses as string[]),
																s.storehouse,
														  ],
											});
										}}
									>
										{s.storehouse}
									</TagButton>
								);
							}
						)}
				</TagContainer>
			</PageBlock>
			<PageBlock title={"Categories"}>
				<TagContainer>
					{getRetailSalesDataCategoriesQuery.data &&
						getRetailSalesDataCategoriesQuery.data.map((c: any) => {
							return (
								<TagButton
									key={c.id}
									selected={kanbanFilter.categories.includes(
										c.category
									)}
									onClick={() => {
										dispatchKanbanFilter({
											type: "SET_CATEGORIES",
											payload:
												kanbanFilter.categories.includes(
													c.category
												)
													? (
															kanbanFilter.categories as string[]
													  ).filter(
															(category) =>
																category !==
																c.category
													  )
													: [
															...(kanbanFilter.categories as string[]),
															c.category,
													  ],
										});
									}}
								>
									{c.category}
								</TagButton>
							);
						})}
				</TagContainer>
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-2">
						<div>SKU</div>
						<OnlineDropdown<Sku>
							placeholder="Search SKU..."
							selected={kanbanFilter.skus}
							setSelected={(selected) =>
								dispatchKanbanFilter({
									type: "SET_SKUS",
									payload: selected as Sku[],
								})
							}
							multiple
							fetchOptions={handleSearchSku}
							labelKey="nameZhCn"
							renderOption={(option) => (
								<div
									className="flex flex-col
									text-xs text-neutral-400"
								>
									<span>{option.nameZhCn}</span>
									<span>{option.sku}</span>
								</div>
							)}
						/>
					</div>
				}
			>
				<TagContainer>
					{kanbanFilter.skus &&
						(kanbanFilter.skus as Sku[]).map((s: Sku) => {
							return (
								<button
									key={s.id}
									onClick={() => handleDeselect(s)}
									className="flex flex-col items-start px-1
									text-xs text-neutral-300 hover:line-through
									bg-neutral-600
									border border-neutral-700 cursor-pointer rounded"
								>
									<span>{s.nameZhCn}</span>
									<span className="text-neutral-400">
										{s.sku}
									</span>
								</button>
							);
						})}
				</TagContainer>
			</PageBlock>
		</PageContainer>
	);
};
