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
	searchRetailSalesDataSku,
} from "@/utils/api/app/retail/sales-data";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
	ActionDispatch,
	MouseEventHandler,
	ReactNode,
	SetStateAction,
	useEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import {
	KanbanFilterAction,
	kanbanFilterReducer,
	KanbanFilterState,
	Sku,
} from "./kanbanFilterReducer";
import { Toggle } from "@/components/toggle/Toggle";
import {
	FilterAltOffOutlined,
	FilterAltOutlined,
	GridOnOutlined,
	PollOutlined,
} from "./Icons";
import { motion, useInView } from "motion/react";
import { createPortal } from "react-dom";
import { FullModal } from "@/components/full-modal/FullModal";
import { OneRowSkeleton } from "@/components/skeleton/OneRowSkeleton";
import { TimeSalesVolume } from "./filter-results/time-sales-volume/TimeSalesVolume";
import { StorehousesSalesVolume } from "./filter-results/storehouses-sales-volume/StorehousesSalesVolume";
import { TimeTaxInclusivePrice } from "./filter-results/time-tax-inclusive-price/TimeTaxInclusivePrice";
import { TimePrice } from "./filter-results/time-price/TimePrice";
import { StorehousesTaxInclusivePrice } from "./filter-results/storehouses-tax-inclusive-price/StorehousesTaxInclusivePrice";
import { ClientsSalesVolume } from "./filter-results/clients-sales-volume/ClientsSalesVolume";
import { ClientsTaxInclusivePriceCny } from "./filter-results/clients-tax-inclusive-price/ClientsTaxInclusivePriceCny";
import { ClientsPriceCny } from "./filter-results/clients-price/ClientsPriceCny";
import { FilteredRetailSalesDataResponse } from "../types";
import { ProductsSalesVolume } from "./filter-results/products-sales-volume/ProductsSalesVolume";

const TagContainer = (props: any) => {
	const { children } = props;
	return (
		<div className="border-t border-neutral-700">
			<div className="flex flex-wrap px-6 py-3 gap-1.5">{children}</div>
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
			// disabled={!isAvailable}
			className={`px-1
			text-sm
			${isSelected && "text-neutral-300 bg-neutral-600"}
			border border-neutral-700
			rounded cursor-pointer ${!isAvailable && "opacity-50"}`}
		>
			{children}
		</button>
	);
};

const TagFilterClearButton = (props: {
	onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
	const { onClick } = props;
	return (
		<button
			className="p-1
			text-neutral-400 hover:text-neutral-300
			bg-neutral-700 hover:bg-neutral-600
			rounded cursor-pointer"
			onClick={onClick}
		>
			<FilterAltOffOutlined size={16} />
		</button>
	);
};

const TagFilters = (props: {
	kanbanFilter: KanbanFilterState;
	dispatchKanbanFilter: ActionDispatch<[action: KanbanFilterAction]>;
	fetchFilteredSalesDataMutation: UseMutationResult<
		FilteredRetailSalesDataResponse,
		Error,
		any,
		unknown
	>;
}) => {
	const {
		kanbanFilter,
		dispatchKanbanFilter,
		fetchFilteredSalesDataMutation,
	} = props;

	const jwt = useAuthStore((state) => state.jwt);

	async function handleSearchSku(term: string) {
		const sku = await searchRetailSalesDataSku(term, jwt);
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
		<div className="flex flex-col gap-3">
			<PageBlock title={"Kanban"}>
				<TagContainer>
					{kanbanFilter.dateMode === "range" && (
						<div className="flex items-center gap-3">
							<DateRangePicker
								range={kanbanFilter.dateRange}
								setRange={(
									value: SetStateAction<DateRange>
								) => {
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
							{[7, 14, 30, 60].map((days) => {
								const isSelected =
									kanbanFilter.dateRange.start.isSame(
										dayjs().subtract(days, "day"),
										"day"
									) &&
									kanbanFilter.dateRange.end.isSame(
										dayjs(),
										"day"
									);
								return (
									<button
										key={days}
										className={`px-2.5 py-0.5
										text-sm
										${isSelected ? "bg-neutral-600 text-white" : ""}
										border border-neutral-700
										rounded cursor-pointer`}
										onClick={() => {
											dispatchKanbanFilter({
												type: "SET_DATE_RANGE",
												payload: {
													start: dayjs().subtract(
														days,
														"day"
													),
													end: dayjs(),
												},
											});
										}}
									>
										Last {days} days
									</button>
								);
							})}
						</div>
					)}
				</TagContainer>
			</PageBlock>
			<PageBlock
				title={"Clients"}
				moreMenu={
					<TagFilterClearButton
						onClick={() => {
							dispatchKanbanFilter({
								type: "SET_CLIENTS",
								payload: [],
							});
						}}
					/>
				}
			>
				<TagContainer>
					{fetchFilteredSalesDataMutation.data ? (
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
							})
					) : (
						<OneRowSkeleton />
					)}
				</TagContainer>
			</PageBlock>
			<PageBlock
				title={"Storehouses"}
				moreMenu={
					<TagFilterClearButton
						onClick={() => {
							dispatchKanbanFilter({
								type: "SET_STOREHOUSES",
								payload: [],
							});
						}}
					/>
				}
			>
				<TagContainer>
					{fetchFilteredSalesDataMutation.data ? (
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
							})
					) : (
						<OneRowSkeleton />
					)}
				</TagContainer>
			</PageBlock>
			<PageBlock
				title={"Categories"}
				moreMenu={
					<TagFilterClearButton
						onClick={() => {
							dispatchKanbanFilter({
								type: "SET_CATEGORIES",
								payload: [],
							});
						}}
					/>
				}
			>
				<TagContainer>
					{fetchFilteredSalesDataMutation.data ? (
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
							})
					) : (
						<OneRowSkeleton />
					)}
				</TagContainer>
			</PageBlock>
			<PageBlock
				title={"Receipt Types"}
				moreMenu={
					<TagFilterClearButton
						onClick={() => {
							dispatchKanbanFilter({
								type: "SET_RECEIPT_TYPES",
								payload: [],
							});
						}}
					/>
				}
			>
				<TagContainer>
					{fetchFilteredSalesDataMutation.data ? (
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
							})
					) : (
						<OneRowSkeleton />
					)}
				</TagContainer>
			</PageBlock>
			<PageBlock
				title={"Source Attributes"}
				moreMenu={
					<TagFilterClearButton
						onClick={() => {
							dispatchKanbanFilter({
								type: "SET_SOURCE_ATTRIBUTES",
								payload: [],
							});
						}}
					/>
				}
			>
				<TagContainer>
					{fetchFilteredSalesDataMutation.data ? (
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
							})
					) : (
						<OneRowSkeleton />
					)}
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
				moreMenu={
					<TagFilterClearButton
						onClick={() => {
							dispatchKanbanFilter({
								type: "SET_SKUS",
								payload: [],
							});
						}}
					/>
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
		</div>
	);
};

export const Content = () => {
	const [showChart, setShowChart] = useState<boolean>(false);
	const [showMonthly, setShowMonthly] = useState<boolean>(true);
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
			{/* scroll anchor */}
			<motion.div
				ref={ref}
				className="absolute top-40 w-4 h-4"
			></motion.div>
			{!isInView && (
				<motion.button
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex justify-center items-center fixed top-24 right-12 w-8 h-8 z-5
					text-white/80
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
					<TagFilters
						kanbanFilter={kanbanFilter}
						dispatchKanbanFilter={dispatchKanbanFilter}
						fetchFilteredSalesDataMutation={
							fetchFilteredSalesDataMutation
						}
					/>
				</FullModal>,
				document.body
			)}
			<TagFilters
				kanbanFilter={kanbanFilter}
				dispatchKanbanFilter={dispatchKanbanFilter}
				fetchFilteredSalesDataMutation={fetchFilteredSalesDataMutation}
			/>
			<PageBlock
				title={
					<div className="flex items-center gap-6">
						<div>Products - Sales Volume</div>
						<div className="flex items-center gap-2">
							<GridOnOutlined size={16} />
							<Toggle
								isOn={showChart}
								onClick={() => {
									setShowChart(!showChart);
								}}
								isAllowed={true}
							/>
							<PollOutlined size={16} />
						</div>
					</div>
				}
				allowCollapse={true}
			>
				{fetchFilteredSalesDataMutation.data && (
					<ProductsSalesVolume
						showChart={showChart}
						fetchFilteredSalesData={
							fetchFilteredSalesDataMutation.data.retailSalesData
						}
					/>
				)}
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-6">
						<div>Time - Sales Volume</div>
						<div className="flex items-center gap-2">
							<GridOnOutlined size={16} />
							<Toggle
								isOn={showChart}
								onClick={() => {
									setShowChart(!showChart);
								}}
								isAllowed={true}
							/>
							<PollOutlined size={16} />
						</div>
						<div className="flex items-center gap-2">
							<div className="text-sm text-neutral-400">
								Daily
							</div>
							<Toggle
								isOn={showMonthly}
								onClick={() => {
									setShowMonthly(!showMonthly);
								}}
								isAllowed={true}
							/>
							<div className="text-sm text-neutral-400">
								Monthly
							</div>
						</div>
					</div>
				}
				allowCollapse={true}
			>
				{fetchFilteredSalesDataMutation.data && (
					<TimeSalesVolume
						showMonthly={showMonthly}
						showChartDailySales={showChart}
						fetchFilteredSalesData={
							fetchFilteredSalesDataMutation.data.retailSalesData
						}
					/>
				)}
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-6">
						<div>Time - GMV (Tax Inclusive)</div>
						<div className="flex items-center gap-2">
							<GridOnOutlined size={16} />
							<Toggle
								isOn={showChart}
								onClick={() => {
									setShowChart(!showChart);
								}}
								isAllowed={true}
							/>
							<PollOutlined size={16} />
						</div>
						<div className="flex items-center gap-2">
							<div className="text-sm text-neutral-400">
								Daily
							</div>
							<Toggle
								isOn={showMonthly}
								onClick={() => {
									setShowMonthly(!showMonthly);
								}}
								isAllowed={true}
							/>
							<div className="text-sm text-neutral-400">
								Monthly
							</div>
						</div>
					</div>
				}
				allowCollapse={true}
			>
				{fetchFilteredSalesDataMutation.data && (
					<TimeTaxInclusivePrice
						showMonthly={showMonthly}
						showChartDailySales={showChart}
						fetchFilteredSalesData={
							fetchFilteredSalesDataMutation.data.retailSalesData
						}
					/>
				)}
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-6">
						<div>Time - GMV</div>
						<div className="flex items-center gap-2">
							<GridOnOutlined size={16} />
							<Toggle
								isOn={showChart}
								onClick={() => {
									setShowChart(!showChart);
								}}
								isAllowed={true}
							/>
							<PollOutlined size={16} />
						</div>
						<div className="flex items-center gap-2">
							<div className="text-sm text-neutral-400">
								Daily
							</div>
							<Toggle
								isOn={showMonthly}
								onClick={() => {
									setShowMonthly(!showMonthly);
								}}
								isAllowed={true}
							/>
							<div className="text-sm text-neutral-400">
								Monthly
							</div>
						</div>
					</div>
				}
				allowCollapse={true}
			>
				{fetchFilteredSalesDataMutation.data && (
					<TimePrice
						showMonthly={showMonthly}
						showChartDailySales={showChart}
						fetchFilteredSalesData={
							fetchFilteredSalesDataMutation.data.retailSalesData
						}
					/>
				)}
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-6">
						<div>Storehouses - Sales Volume</div>
						<div className="flex items-center gap-2">
							<GridOnOutlined size={16} />
							<Toggle
								isOn={showChart}
								onClick={() => {
									setShowChart(!showChart);
								}}
								isAllowed={true}
							/>
							<PollOutlined size={16} />
						</div>
					</div>
				}
				allowCollapse={true}
			>
				{fetchFilteredSalesDataMutation.data && (
					<StorehousesSalesVolume
						showChart={showChart}
						fetchFilteredSalesData={
							fetchFilteredSalesDataMutation.data.retailSalesData
						}
					/>
				)}
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-6">
						<div>Storehouses - GMV (Tax Inclusive)</div>
						<div className="flex items-center gap-2">
							<GridOnOutlined size={16} />
							<Toggle
								isOn={showChart}
								onClick={() => {
									setShowChart(!showChart);
								}}
								isAllowed={true}
							/>
							<PollOutlined size={16} />
						</div>
					</div>
				}
				allowCollapse={true}
			>
				{fetchFilteredSalesDataMutation.data && (
					<StorehousesTaxInclusivePrice
						showChart={showChart}
						fetchFilteredSalesData={
							fetchFilteredSalesDataMutation.data.retailSalesData
						}
					/>
				)}
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-6">
						<div>Client - Sales Volume</div>
						<div className="flex items-center gap-2">
							<GridOnOutlined size={16} />
							<Toggle
								isOn={showChart}
								onClick={() => {
									setShowChart(!showChart);
								}}
								isAllowed={true}
							/>
							<PollOutlined size={16} />
						</div>
					</div>
				}
				allowCollapse={true}
			>
				{fetchFilteredSalesDataMutation.data && (
					<ClientsSalesVolume
						showChart={showChart}
						fetchFilteredSalesData={
							fetchFilteredSalesDataMutation.data.retailSalesData
						}
					/>
				)}
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-6">
						<div>Client - GMV (Tax Inclusive)</div>
						<div className="flex items-center gap-2">
							<GridOnOutlined size={16} />
							<Toggle
								isOn={showChart}
								onClick={() => {
									setShowChart(!showChart);
								}}
								isAllowed={true}
							/>
							<PollOutlined size={16} />
						</div>
					</div>
				}
				allowCollapse={true}
			>
				{fetchFilteredSalesDataMutation.data && (
					<ClientsTaxInclusivePriceCny
						showChart={showChart}
						fetchFilteredSalesData={
							fetchFilteredSalesDataMutation.data.retailSalesData
						}
					/>
				)}
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-6">
						<div>Client - GMV</div>
						<div className="flex items-center gap-2">
							<GridOnOutlined size={16} />
							<Toggle
								isOn={showChart}
								onClick={() => {
									setShowChart(!showChart);
								}}
								isAllowed={true}
							/>
							<PollOutlined size={16} />
						</div>
					</div>
				}
				allowCollapse={true}
			>
				{fetchFilteredSalesDataMutation.data && (
					<ClientsPriceCny
						showChart={showChart}
						fetchFilteredSalesData={
							fetchFilteredSalesDataMutation.data.retailSalesData
						}
					/>
				)}
			</PageBlock>
		</PageContainer>
	);
};
