import { Table, Tbody, Thead } from "@/components/content/Table";
import { RetailSalesDataResponse } from "../../../types";
import { useReducer } from "react";
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
	};
	const reducedData: ReducedData[] = fetchFilteredSalesData.reduce(
		(acc, curr) => {
			const productNameZhCn = curr.productNameZhCn;
			const salesVolume = curr.salesVolume;
			const existingProduct = acc.find(
				(d) => d.productNameZhCn === productNameZhCn
			);
			if (existingProduct) {
				existingProduct.salesVolume += salesVolume;
			} else {
				acc.push({
					productId: curr.productId,
					productSku: curr.productSku,
					productNameZhCn,
					salesVolume,
				});
			}
			return acc;
		},
		[] as ReducedData[]
	);
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
				} else if (column === "salesVolume") {
					return multiplier * (a.salesVolume - b.salesVolume);
				}
				return 0;
			});

			return (
				<ResultWrapper>
					<Table>
						<Thead>
							<tr>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Date ({reducedData.length}){" "}
										<button
											className="flex items-center 
											bg-neutral-700 hover:bg-neutral-600
											rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_PRODUCT",
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
										Sales Volume{" "}
										<button
											className="flex items-center 
											bg-neutral-700 hover:bg-neutral-600
											rounded cursor-pointer"
											onClick={() => {
												dispatch({
													type: "SORT_BY_SALES_VOLUME",
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
							</tr>
						</Thead>
						<Tbody>
							{sortedData.map((d) => {
								return (
									<tr key={d.productNameZhCn}>
										<td>{d.productNameZhCn}</td>
										<td>{d.salesVolume}</td>
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
