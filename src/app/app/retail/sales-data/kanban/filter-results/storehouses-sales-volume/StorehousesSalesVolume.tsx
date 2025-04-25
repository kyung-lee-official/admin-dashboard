import { Table, Tbody, Thead } from "@/components/content/Table";
import { RetailSalesDataResponse } from "../../../types";
import { useReducer } from "react";
import { storehousesSalesVolumeReducer } from "./storehousesSalesVolumeReducer";
import { SwapVert } from "../../Icons";

export const StorehousesSalesVolume = (props: {
	showChartStorehousesSales: boolean;
	fetchFilteredSalesData: RetailSalesDataResponse[];
}) => {
	const { showChartStorehousesSales, fetchFilteredSalesData } = props;

	/**
	 * convert to array of storehouse-salesVolume objects
	 */
	type ReducedData = { storehouse: string; salesVolume: number };
	const reducedData: ReducedData[] = fetchFilteredSalesData.reduce(
		(acc, curr) => {
			const storehouse = curr.storehouse;
			const salesVolume = curr.salesVolume;
			const existingStorehouse = acc.find(
				(d) => d.storehouse === storehouse
			);
			if (existingStorehouse) {
				existingStorehouse.salesVolume += salesVolume;
			} else {
				acc.push({ storehouse, salesVolume });
			}
			return acc;
		},
		[] as ReducedData[]
	);

	const [sortState, dispatch] = useReducer(storehousesSalesVolumeReducer, {
		column: "storehouses",
		direction: "asc",
	});

	switch (showChartStorehousesSales) {
		case true:
			return (
				<div className="relative h-[525px] px-6 py-3 border-t border-neutral-700">
					<div className="flex flex-col justify-center items-center h-full gap-6">
						<img
							src="/resultPages/underConstruction.png"
							width={350}
							alt="Under Planning"
							className="opacity-90"
						/>
						<div className="text-lg">
							This feature is under construction...
						</div>
					</div>
				</div>
			);
		case false:
			const sortedData = [...reducedData].sort((a, b) => {
				const { column, direction } = sortState;
				const multiplier = direction === "asc" ? 1 : -1;
				if (column === "storehouses") {
					return (
						multiplier * a.storehouse.localeCompare(b.storehouse)
					);
				} else if (column === "salesVolume") {
					return multiplier * (a.salesVolume - b.salesVolume);
				}
				return 0;
			});

			return (
				<div className="h-[525px] overflow-y-auto scrollbar">
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
													type: "SORT_BY_STOREHOUSES",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"storehouses"
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
									<tr key={d.storehouse}>
										<td>{d.storehouse}</td>
										<td>{d.salesVolume}</td>
									</tr>
								);
							})}
						</Tbody>
					</Table>
				</div>
			);
		default:
			return null;
	}
};
