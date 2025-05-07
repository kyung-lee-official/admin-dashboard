import { Table, Tbody, Thead } from "@/components/content/Table";
import { RetailSalesDataResponse } from "../../../types";
import { useCallback, useMemo, useReducer } from "react";
import { productSalesVolumeReducer } from "./productsSalesVolumeReducer";
import { SwapVert } from "../../Icons";
import { PieChart } from "@/components/charts/piechart/PieChart";
import { ResultWrapper } from "../ResultWrapper";

export const ProductsSalesVolume = (props: {
	showChart: boolean;
	fetchFilteredSalesData: RetailSalesDataResponse[];
}) => {
	const { showChart, fetchFilteredSalesData } = props;
	const width = 900;
	const height = 500;
	const margin = { top: 80, left: 100, right: 100, bottom: 80 };

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
			const sortedData = [...reducedData].sort((a, b) => {
				const { column, direction } = sortState;
				const multiplier = direction === "asc" ? 1 : -1;

				if (column === "product") {
					return (
						multiplier *
						a.productNameZhCn.localeCompare(b.productNameZhCn)
					);
				} else if (column === "productSku") {
					return (
						multiplier * a.productSku.localeCompare(b.productSku)
					);
				} else if (column === "salesVolume") {
					return multiplier * (a.salesVolume - b.salesVolume);
				} else if (column === "last7Days") {
					return multiplier * (a.last7Days - b.last7Days);
				} else if (column === "last14Days") {
					return multiplier * (a.last14Days - b.last14Days);
				} else if (column === "last30Days") {
					return multiplier * (a.last30Days - b.last30Days);
				} else if (column === "last60Days") {
					return multiplier * (a.last60Days - b.last60Days);
				} else if (column === "last7DaysAverage") {
					return (
						multiplier * (a.last7DaysAverage - b.last7DaysAverage)
					);
				} else if (column === "last30DaysAverage") {
					return (
						multiplier * (a.last30DaysAverage - b.last30DaysAverage)
					);
				}

				return 0; /* default case */
			});

			return (
				<ResultWrapper>
					<Table>
						<Thead>
							<tr>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Product ({reducedData.length}){" "}
										<button
											className="flex items-center 
											bg-neutral-700 hover:bg-neutral-600
											rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_COLUMN",
													payload: "product",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"product"
														? sortState.direction
														: null
												}
											/>
										</button>
									</div>
								</th>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Product SKU{" "}
										<button
											className="flex items-center 
											bg-neutral-700 hover:bg-neutral-600
											rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_COLUMN",
													payload: "productSku",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"productSku"
														? sortState.direction
														: null
												}
											/>
										</button>
									</div>
								</th>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Sales Volume{" "}
										<button
											className="flex items-center 
											bg-neutral-700 hover:bg-neutral-600
											rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_COLUMN",
													payload: "salesVolume",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"salesVolume"
														? sortState.direction
														: null
												}
											/>
										</button>
									</div>
								</th>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Last 7 Days{" "}
										<button
											className="flex items-center 
                                            bg-neutral-700 hover:bg-neutral-600
                                            rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_COLUMN",
													payload: "last7Days",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"last7Days"
														? sortState.direction
														: null
												}
											/>
										</button>
									</div>
								</th>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Last 14 Days{" "}
										<button
											className="flex items-center 
                                            bg-neutral-700 hover:bg-neutral-600
                                            rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_COLUMN",
													payload: "last14Days",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"last14Days"
														? sortState.direction
														: null
												}
											/>
										</button>
									</div>
								</th>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Last 30 Days{" "}
										<button
											className="flex items-center 
                                            bg-neutral-700 hover:bg-neutral-600
                                            rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_COLUMN",
													payload: "last30Days",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"last30Days"
														? sortState.direction
														: null
												}
											/>
										</button>
									</div>
								</th>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Last 60 Days{" "}
										<button
											className="flex items-center 
                                            bg-neutral-700 hover:bg-neutral-600
                                            rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_COLUMN",
													payload: "last60Days",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"last60Days"
														? sortState.direction
														: null
												}
											/>
										</button>
									</div>
								</th>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Last 7 Days Average{" "}
										<button
											className="flex items-center 
                                            bg-neutral-700 hover:bg-neutral-600
                                            rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_COLUMN",
													payload:
														"last60DaysAverage",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"last60DaysAverage"
														? sortState.direction
														: null
												}
											/>
										</button>
									</div>
								</th>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Last 30 Days Average{" "}
										<button
											className="flex items-center 
											bg-neutral-700 hover:bg-neutral-600
											rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_COLUMN",
													payload:
														"last30DaysAverage",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"last30DaysAverage"
														? sortState.direction
														: null
												}
											/>
										</button>
									</div>
								</th>
							</tr>
						</Thead>
						<Tbody>
							{sortedData.map((d) => {
								return (
									<tr key={d.productSku}>
										<td>{d.productNameZhCn}</td>
										<td>{d.productSku}</td>
										<td>{d.salesVolume}</td>
										<td>{d.last7Days}</td>
										<td>{d.last14Days}</td>
										<td>{d.last30Days}</td>
										<td>{d.last60Days}</td>
										<td>{d.last7DaysAverage.toFixed(2)}</td>
										<td>
											{d.last30DaysAverage.toFixed(2)}
										</td>
									</tr>
								);
							})}
						</Tbody>
					</Table>
				</ResultWrapper>
			);
		default:
			return null;
	}
};
