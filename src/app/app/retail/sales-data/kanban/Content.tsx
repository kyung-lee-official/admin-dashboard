"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import {
	DateRange,
	DateRangePicker,
} from "@/components/date/date-range-picker/DateRangePicker";
import { Dropdown as OnlineDropdown } from "@/components/input/online-dropdown/Dropdown";
import { useAuthStore } from "@/stores/auth";
import {
	filterRetailSalesData,
	getRetailSalesDataCategories,
	getRetailSalesDataClients,
	getRetailSalesDataReceiptTypes,
	getRetailSalesDataSearchSku,
	getRetailSalesDataSourceAttributes,
	getRetailSalesDataStorehouses,
	RetailSalesDataQK,
} from "@/utils/api/app/retail/sales-data";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { SetStateAction, useEffect, useReducer, useRef, useState } from "react";
import {
	kanbanFilterReducer,
	KanbanFilterState,
	Sku,
} from "./kanbanFilterReducer";
import { DailySales } from "./DailySales";
import { Toggle } from "@/components/toggle/Toggle";
import { FilterAltOutlined, GridOnOutlined, PollOutlined } from "./Icons";
import { motion, useInView } from "motion/react";
import { createPortal } from "react-dom";
import { FullModal } from "@/components/full-modal/FullModal";

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
	const [showChartDailySales, setShowChartDailySales] = useState(false);
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
			receiptTypes: [],
			sourceAttributes: [],
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
	const getRetailSalesDataReceiptTypesQuery = useQuery<any, AxiosError>({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_RECEIPT_TYPES],
		queryFn: async () => {
			const receiptTypes = await getRetailSalesDataReceiptTypes(jwt);
			return receiptTypes;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});
	const getRetailSalesDataSourceAttributesQuery = useQuery<any, AxiosError>({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_SOURCE_ATTRIBUTES],
		queryFn: async () => {
			const sourceAttributes = await getRetailSalesDataSourceAttributes(
				jwt
			);
			return sourceAttributes;
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

	/* mutation to fetch filtered sales data */
	const fetchFilteredSalesDataMutation = useMutation({
		mutationFn: async (filter: KanbanFilterState) => {
			const response = await filterRetailSalesData(filter, jwt);
			return response;
		},
		onSuccess: (data) => {
			// console.log("Filtered sales data:", data);
			/* handle the fetched data (e.g., update state or UI) */
		},
		onError: (error) => {
			console.error("Error fetching filtered sales data:", error);
		},
	});

	/* trigger the mutation whenever kanbanFilter changes */
	useEffect(() => {
		fetchFilteredSalesDataMutation.mutate(kanbanFilter);
	}, [kanbanFilter]);

	/* useInView */
	const ref = useRef(null);
	const isInView = useInView(ref);
	const [showModel, setShowModel] = useState(false);

	return (
		<PageContainer>
			<PageBlock title={"Kanban"}>
				<TagContainer>
					{kanbanFilter.dateMode === "range" && (
						<DateRangePicker
							range={kanbanFilter.dateRange}
							setRange={(value: SetStateAction<DateRange>) => {
								const newRange =
									typeof value === "function"
										? value(kanbanFilter.dateRange)
										: value;
								dispatchKanbanFilter({
									type: "SET_DATE_RANGE",
									payload: {
										start: newRange.start,
										end: newRange.end,
									},
								});
							}}
						/>
					)}
					{/* scroll anchor */}
					<motion.div ref={ref} className="w-4 h-4"></motion.div>
					{!isInView && (
						<motion.button
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex justify-center items-center fixed top-24 right-12 w-8 h-8
							bg-neutral-700
							border border-neutral-600
							shadow rounded cursor-pointer"
							onClick={() => {
								setShowModel(true);
							}}
						>
							<FilterAltOutlined size={18} />
						</motion.button>
					)}
					{createPortal(
						<FullModal show={showModel} setShow={setShowModel}>
							test
						</FullModal>,
						document.body
					)}
				</TagContainer>
			</PageBlock>
			<PageBlock title={"Clients"}>
				<TagContainer>
					{getRetailSalesDataClientsQuery.data &&
						getRetailSalesDataClientsQuery.data
							.sort((a: any, b: any) =>
								a.client.localeCompare(b.client)
							)
							.map((c: any) => {
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
						getRetailSalesDataStorehousesQuery.data
							.sort((a: any, b: any) =>
								a.storehouse.localeCompare(b.storehouse)
							)
							.map((s: any) => {
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
							})}
				</TagContainer>
			</PageBlock>
			<PageBlock title={"Categories"}>
				<TagContainer>
					{getRetailSalesDataCategoriesQuery.data &&
						getRetailSalesDataCategoriesQuery.data
							.sort((a: any, b: any) =>
								a.category.localeCompare(b.category)
							)
							.map((c: any) => {
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
			<PageBlock title={"Receipt Types"}>
				<TagContainer>
					{getRetailSalesDataReceiptTypesQuery.data &&
						getRetailSalesDataReceiptTypesQuery.data
							.sort((a: any, b: any) =>
								a.receiptType.localeCompare(b.receiptType)
							)
							.map((r: any) => {
								return (
									<TagButton
										key={r.id}
										selected={kanbanFilter.receiptTypes.includes(
											r.receiptType
										)}
										onClick={() => {
											dispatchKanbanFilter({
												type: "SET_RECEIPT_TYPES",
												payload:
													kanbanFilter.receiptTypes.includes(
														r.receiptType
													)
														? (
																kanbanFilter.receiptTypes as string[]
														  ).filter(
																(receiptType) =>
																	receiptType !==
																	r.receiptType
														  )
														: [
																...(kanbanFilter.receiptTypes as string[]),
																r.receiptType,
														  ],
											});
										}}
									>
										{r.receiptType}
									</TagButton>
								);
							})}
				</TagContainer>
			</PageBlock>
			<PageBlock title={"Source Attributes"}>
				<TagContainer>
					{getRetailSalesDataSourceAttributesQuery.data &&
						getRetailSalesDataSourceAttributesQuery.data
							.sort((a: any, b: any) =>
								a.sourceAttribute.localeCompare(
									b.sourceAttribute
								)
							)
							.map((sa: any) => {
								return (
									<TagButton
										key={sa.id}
										selected={kanbanFilter.sourceAttributes.includes(
											sa.sourceAttribute
										)}
										onClick={() => {
											dispatchKanbanFilter({
												type: "SET_SOURCE_ATTRIBUTES",
												payload:
													kanbanFilter.sourceAttributes.includes(
														sa.sourceAttribute
													)
														? (
																kanbanFilter.sourceAttributes as string[]
														  ).filter(
																(
																	sourceAttribute
																) =>
																	sourceAttribute !==
																	sa.sourceAttribute
														  )
														: [
																...(kanbanFilter.sourceAttributes as string[]),
																sa.sourceAttribute,
														  ],
											});
										}}
									>
										{sa.sourceAttribute}
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
			<PageBlock
				title={
					<div className="flex items-center gap-6">
						<div>Daily Sales</div>
						<div className="flex items-center gap-2">
							<GridOnOutlined size={16} />
							<Toggle
								isOn={showChartDailySales}
								onClick={() => {
									setShowChartDailySales(
										!showChartDailySales
									);
								}}
								isAllowed={true}
							/>
							<PollOutlined size={16} />
						</div>
					</div>
				}
			>
				{fetchFilteredSalesDataMutation.data && (
					<DailySales
						showChartDailySales={showChartDailySales}
						fetchFilteredSalesData={
							fetchFilteredSalesDataMutation.data
						}
					/>
				)}
			</PageBlock>
		</PageContainer>
	);
};
