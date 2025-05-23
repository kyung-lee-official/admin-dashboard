import { Table, Tbody, Thead } from "@/components/content/Table";
import { RetailSalesDataResponse } from "../../../types";
import { useCallback, useMemo, useReducer, useState } from "react";
import { productSalesVolumeReducer } from "./productsSalesVolumeReducer";
import { SwapVert } from "../../Icons";
import { PieChart } from "@/components/charts/piechart/PieChart";
import { ResultWrapper } from "../ResultWrapper";
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	flexRender,
	SortingState,
} from "@tanstack/react-table";

export const ProductsSalesVolume = (props: {
	showChart: boolean;
	fetchFilteredSalesData: RetailSalesDataResponse[];
}) => {
	const { showChart, fetchFilteredSalesData } = props;
	const width = 900;
	const height = 500;
	const margin = { top: 80, left: 100, right: 100, bottom: 80 };

	const uniqueStorehouses = useMemo(() => {
		return Array.from(
			new Set(fetchFilteredSalesData.map((d) => d.storehouse))
		).filter(Boolean);
	}, [fetchFilteredSalesData]);

	/* helper function to filter sales data by date range */
	const filterByDateRange = useCallback(
		(days: number) => {
			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() - days);
			return fetchFilteredSalesData.filter(
				(data) => new Date(data.date) >= cutoffDate
			);
		},
		[fetchFilteredSalesData]
	);

	/**
	 * convert to array of product-salesVolume objects
	 */
	type ReducedData = {
		productId: number;
		productSku: string;
		productNameZhCn: string;
		salesVolume: number;
		last7Days: number;
		last14Days: number;
		last30Days: number;
		last60Days: number;
		last7DaysAverage: number;
		last30DaysAverage: number;
	};

	const reducedData: ReducedData[] = useMemo(() => {
		/* precompute filtered data for each date range */
		const last7DaysData = filterByDateRange(7);
		const last14DaysData = filterByDateRange(14);
		const last30DaysData = filterByDateRange(30);
		const last60DaysData = filterByDateRange(60);

		return fetchFilteredSalesData.reduce((acc, curr) => {
			const productNameZhCn = curr.productNameZhCn;
			const salesVolume = curr.salesVolume;

			const existingProduct = acc.find(
				(d) => d.productNameZhCn === productNameZhCn
			);

			if (existingProduct) {
				existingProduct.salesVolume += salesVolume;
			} else {
				/* calculate sales volumes using precomputed data */
				const last7Days = last7DaysData.reduce(
					(sum, data) =>
						data.productNameZhCn === productNameZhCn
							? sum + data.salesVolume
							: sum,
					0
				);
				const last14Days = last14DaysData.reduce(
					(sum, data) =>
						data.productNameZhCn === productNameZhCn
							? sum + data.salesVolume
							: sum,
					0
				);
				const last30Days = last30DaysData.reduce(
					(sum, data) =>
						data.productNameZhCn === productNameZhCn
							? sum + data.salesVolume
							: sum,
					0
				);
				const last60Days = last60DaysData.reduce(
					(sum, data) =>
						data.productNameZhCn === productNameZhCn
							? sum + data.salesVolume
							: sum,
					0
				);

				acc.push({
					productId: curr.productId,
					productSku: curr.productSku,
					productNameZhCn,
					salesVolume,
					last7Days,
					last14Days,
					last30Days,
					last60Days,
					last7DaysAverage: last7Days / 7,
					last30DaysAverage: last30Days / 30,
				});
			}
			return acc;
		}, [] as ReducedData[]);
	}, [fetchFilteredSalesData]);
	const totalSalesVolume = reducedData.reduce(
		(acc, curr) => acc + curr.salesVolume,
		0
	);

	const lastNDaysKeys = [
		"last7Days",
		"last14Days",
		"last30Days",
		"last60Days",
	];
	const lastNDaysMap: Record<string, number> = {
		last7Days: 7,
		last14Days: 14,
		last30Days: 30,
		last60Days: 60,
	};
	const [selectedDaysColumn, setSelectedDaysColumn] = useState<string | null>(
		null
	);
	const filteredStorehouseData = useMemo(() => {
		if (!selectedDaysColumn) {
			return fetchFilteredSalesData;
		}
		const days = lastNDaysMap[selectedDaysColumn];
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - days);
		return fetchFilteredSalesData.filter(
			(data) => new Date(data.date) >= cutoffDate
		);
	}, [fetchFilteredSalesData, selectedDaysColumn]);

	const storehouseSalesMap = useMemo(() => {
		const map: Record<string, Record<string, number>> = {};
		filteredStorehouseData.forEach((d) => {
			if (!map[d.productSku]) map[d.productSku] = {};
			map[d.productSku][d.storehouse] =
				(map[d.productSku][d.storehouse] || 0) + d.salesVolume;
		});
		return map;
	}, [filteredStorehouseData]);

	const [sorting, setSorting] = useState<SortingState>([]);
	/* define columns */
	const columns = useMemo(
		() => [
			{
				accessorKey: "productNameZhCn",
				header: "Product",
				enableSorting: true,
				cell: (info: any) => (
					<span className="whitespace-nowrap">{info.getValue()}</span>
				),
			},
			{
				accessorKey: "productSku",
				header: "Product SKU",
				enableSorting: true,
				cell: (info: any) => (
					<span className="whitespace-nowrap">{info.getValue()}</span>
				),
			},
			{
				accessorKey: "salesVolume",
				header: "Sales Volume",
				enableSorting: true,
			},
			{
				accessorKey: "last7Days",
				header: "Last 7 Days",
				enableSorting: true,
			},
			{
				accessorKey: "last14Days",
				header: "Last 14 Days",
				enableSorting: true,
			},
			{
				accessorKey: "last30Days",
				header: "Last 30 Days",
				enableSorting: true,
			},
			{
				accessorKey: "last60Days",
				header: "Last 60 Days",
				enableSorting: true,
			},
			{
				accessorKey: "last7DaysAverage",
				header: "Last 7 Days Avg",
				enableSorting: true,
				cell: (info: any) => Number(info.getValue()).toFixed(2),
			},
			{
				accessorKey: "last30DaysAverage",
				header: "Last 30 Days Avg",
				enableSorting: true,
				cell: (info: any) => Number(info.getValue()).toFixed(2),
			},
			/* dynamic storehouse columns */
			...uniqueStorehouses.map((storehouse) => ({
				id: `storehouse_${storehouse}`,
				header: storehouse,
				enableSorting: true,
				accessorFn: (row: any) => storehouseSalesMap[row.productSku]?.[storehouse] ?? 0,
				cell: (info: any) => {
					const sku = info.row.original.productSku;
					return (
						<span className="whitespace-nowrap">
							{storehouseSalesMap[sku]?.[storehouse] || 0}
						</span>
					);
				},
			})),
		],
		[uniqueStorehouses, storehouseSalesMap]
	);

	/* setup table instance */
	const table = useReactTable({
		data: reducedData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
		onSortingChange: setSorting,
	});

	const [sortState, dispatch] = useReducer(productSalesVolumeReducer, {
		column: "product",
		direction: "asc",
	});

	switch (showChart) {
		case true:
			return (
				<div className="relative h-[525px] px-6 py-3 border-t border-neutral-700">
					<PieChart
						data={reducedData
							.map((d) => {
								return {
									productNameZhCn: d.productNameZhCn,
									salesVolume: d.salesVolume,
								};
							})
							.sort((a, b) => b.salesVolume - a.salesVolume)
							.slice(0, 20)}
						svgWidth={width}
						svgHeight={height}
						margin={margin}
						padAngle={0.005}
						textFormatter={(value, data) => {
							const percentage = (
								(Number(data.salesVolume) / totalSalesVolume) *
								100
							).toFixed(2);
							return `${data.productNameZhCn}, ${percentage}%`;
						}}
					/>
				</div>
			);
		case false:
			return (
				<ResultWrapper>
					<Table>
						<Thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const isLastNDays =
											lastNDaysKeys.includes(
												header.column.id
											);
										return (
											<th
												key={header.id}
												className={`cursor-pointer 
													${
														isLastNDays &&
														selectedDaysColumn ===
															header.column.id
															? "bg-green-900"
															: ""
													}`}
												onClick={
													isLastNDays
														? () =>
																setSelectedDaysColumn(
																	selectedDaysColumn ===
																		header
																			.column
																			.id
																		? null
																		: header
																				.column
																				.id
																)
														: undefined
												}
											>
												<div
													className="flex gap-2
													truncate"
												>
													{flexRender(
														header.column.columnDef
															.header,
														header.getContext()
													)}
													<button
														className="flex items-center 
														bg-neutral-700 hover:bg-neutral-600
														rounded cursor-pointer"
														onClick={header.column.getToggleSortingHandler()}
													>
														<SwapVert
															size={20}
															direction={
																header.column.getIsSorted() ===
																false
																	? null
																	: (header.column.getIsSorted() as
																			| "asc"
																			| "desc")
															}
														/>
													</button>
												</div>
											</th>
										);
									})}
								</tr>
							))}
						</Thead>
						<Tbody>
							{table.getRowModel().rows.map((row) => (
								<tr key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className="whitespace-nowrap"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							))}
						</Tbody>
					</Table>
				</ResultWrapper>
			);

		default:
			return null;
	}
};
