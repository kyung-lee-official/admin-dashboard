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
import {
	MouseEventHandler,
	ReactNode,
	SetStateAction,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
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
import { FilteredRetailSalesDataResponse } from "../types";

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

const TagButton = (props: {
	children: ReactNode;
	isSelected: any;
	isAvailable: boolean;
	onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
	const { children, isSelected, isAvailable, onClick } = props;
	return (
		<button
			onClick={onClick}
			disabled={!isAvailable}
			className={`px-1
			text-sm
			${isSelected && "text-neutral-300 bg-neutral-600"}
			border border-neutral-700
			rounded ${isAvailable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
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
					{fetchFilteredSalesDataMutation.data &&
						fetchFilteredSalesDataMutation.data.clients.allClients
							.sort((a: string, b: string) => a.localeCompare(b))
							.map((c: string) => {
								const isSelected =
									kanbanFilter.clients.includes(c);
								const isAvailable =
									fetchFilteredSalesDataMutation.data.clients.availableClients.includes(
										c
									);
								return (
									<TagButton
										key={c}
										isSelected={isSelected}
										isAvailable={isAvailable}
										onClick={() => {
											dispatchKanbanFilter({
												type: "SET_CLIENTS",
												payload: isSelected
													? (
															kanbanFilter.clients as string[]
													  ).filter(
															(client) =>
																client !== c
													  )
													: [
															...(kanbanFilter.clients as string[]),
															c,
													  ],
											});
										}}
									>
										{c}
									</TagButton>
								);
							})}
				</TagContainer>
			</PageBlock>
			<PageBlock title={"Storehouses"}>
				<TagContainer>
					{fetchFilteredSalesDataMutation.data &&
						fetchFilteredSalesDataMutation.data.storehouses.allStorehouses
							.sort((a: string, b: string) => a.localeCompare(b))
							.map((s: string) => {
								const isSelected =
									kanbanFilter.storehouses.includes(s);
								const isAvailable =
									fetchFilteredSalesDataMutation.data.storehouses.availableStorehouses.includes(
										s
									);
								return (
									<TagButton
										key={s}
										isSelected={isSelected}
										isAvailable={isAvailable}
										onClick={() => {
											dispatchKanbanFilter({
												type: "SET_STOREHOUSES",
												payload: isSelected
													? (
															kanbanFilter.storehouses as string[]
													  ).filter(
															(storehouse) =>
																storehouse !== s
													  )
													: [
															...(kanbanFilter.storehouses as string[]),
															s,
													  ],
											});
										}}
									>
										{s}
									</TagButton>
								);
							})}
				</TagContainer>
			</PageBlock>
			<PageBlock title={"Categories"}>
				<TagContainer>
					{fetchFilteredSalesDataMutation.data &&
						fetchFilteredSalesDataMutation.data.categories.allCategories
							.sort((a: string, b: string) => a.localeCompare(b))
							.map((c: string) => {
								const isSelected =
									kanbanFilter.categories.includes(c);
								const isAvailable =
									fetchFilteredSalesDataMutation.data.categories.availableCategories.includes(
										c
									);
								return (
									<TagButton
										key={c}
										isSelected={isSelected}
										isAvailable={isAvailable}
										onClick={() => {
											dispatchKanbanFilter({
												type: "SET_CATEGORIES",
												payload: isSelected
													? (
															kanbanFilter.categories as string[]
													  ).filter(
															(category) =>
																category !== c
													  )
													: [
															...(kanbanFilter.categories as string[]),
															c,
													  ],
											});
										}}
									>
										{c}
									</TagButton>
								);
							})}
				</TagContainer>
			</PageBlock>
			<PageBlock title={"Receipt Types"}>
				<TagContainer>
					{fetchFilteredSalesDataMutation.data &&
						fetchFilteredSalesDataMutation.data.receiptTypes.allReceiptTypes
							.sort((a: string, b: string) => a.localeCompare(b))
							.map((rt: string) => {
								const isSelected =
									kanbanFilter.receiptTypes.includes(rt);
								const isAvailable =
									fetchFilteredSalesDataMutation.data.receiptTypes.availableReceiptTypes.includes(
										rt
									);
								return (
									<TagButton
										key={rt}
										isSelected={isSelected}
										isAvailable={isAvailable}
										onClick={() => {
											dispatchKanbanFilter({
												type: "SET_RECEIPT_TYPES",
												payload: isSelected
													? (
															kanbanFilter.receiptTypes as string[]
													  ).filter(
															(receiptType) =>
																receiptType !==
																rt
													  )
													: [
															...(kanbanFilter.receiptTypes as string[]),
															rt,
													  ],
											});
										}}
									>
										{rt}
									</TagButton>
								);
							})}
				</TagContainer>
			</PageBlock>
			<PageBlock title={"Source Attributes"}>
				<TagContainer>
					{fetchFilteredSalesDataMutation.data &&
						fetchFilteredSalesDataMutation.data.sourceAttributes.allSourceAttributes
							.sort((a: string, b: string) => a.localeCompare(b))
							.map((sa: string) => {
								const isSelected =
									kanbanFilter.sourceAttributes.includes(sa);
								const isAvailable =
									fetchFilteredSalesDataMutation.data.sourceAttributes.availableSourceAttributes.includes(
										sa
									);
								return (
									<TagButton
										key={sa}
										isSelected={isSelected}
										isAvailable={isAvailable}
										onClick={() => {
											dispatchKanbanFilter({
												type: "SET_SOURCE_ATTRIBUTES",
												payload: isSelected
													? (
															kanbanFilter.sourceAttributes as string[]
													  ).filter(
															(sourceAttribute) =>
																sourceAttribute !==
																sa
													  )
													: [
															...(kanbanFilter.sourceAttributes as string[]),
															sa,
													  ],
											});
										}}
									>
										{sa}
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
							fetchFilteredSalesDataMutation.data.retailSalesData
						}
					/>
				)}
			</PageBlock>
		</PageContainer>
	);
};
