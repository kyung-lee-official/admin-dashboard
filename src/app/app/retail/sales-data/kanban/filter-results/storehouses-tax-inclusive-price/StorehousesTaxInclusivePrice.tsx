import { Table, Tbody, Thead } from "@/components/content/Table";
import { RetailSalesDataResponse } from "../../../types";
import { useReducer } from "react";
import { SwapVert } from "../../Icons";
import { storehousesTaxInclusivePriceReducer } from "./storehousesTaxInclusivePriceReducer";
import { convertNumberToHumanReadable } from "num-guru";

export const StorehousesTaxInclusivePrice = (props: {
	showChart: boolean;
	fetchFilteredSalesData: RetailSalesDataResponse[];
}) => {
	const { showChart, fetchFilteredSalesData } = props;

	/**
	 * convert to array of storehouse-taxInclusivePriceCny objects
	 */
	type ReducedData = { storehouse: string; taxInclusivePriceCny: number };
	const reducedData: ReducedData[] = fetchFilteredSalesData.reduce(
		(acc, curr) => {
			const storehouse = curr.storehouse;
			const taxInclusivePriceCny = curr.taxInclusivePriceCny || 0;
			const existingStorehouse = acc.find(
				(d) => d.storehouse === storehouse
			);
			if (existingStorehouse) {
				existingStorehouse.taxInclusivePriceCny += taxInclusivePriceCny;
			} else {
				acc.push({ storehouse, taxInclusivePriceCny });
			}
			return acc;
		},
		[] as ReducedData[]
	);

	const [sortState, dispatch] = useReducer(
		storehousesTaxInclusivePriceReducer,
		{
			column: "storehouses",
			direction: "asc",
		}
	);

	switch (showChart) {
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
				} else if (column === "taxInclusivePriceCny") {
					return (
						multiplier *
						(a.taxInclusivePriceCny - b.taxInclusivePriceCny)
					);
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
													"taxInclusivePriceCny"
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
										<td>
											¥{" "}
											{convertNumberToHumanReadable(
												d.taxInclusivePriceCny,
												{
													useComma: true,
													useSuffix: false,
												}
											)}
										</td>
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
