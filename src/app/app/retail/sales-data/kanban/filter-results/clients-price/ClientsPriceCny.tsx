import { Table, Tbody, Thead } from "@/components/content/Table";
import { RetailSalesDataResponse } from "../../../types";
import { useReducer } from "react";
import { SwapVert } from "../../Icons";
import { clientsPriceReducer } from "./clientsPriceReducer";
import { convertNumberToHumanReadable } from "num-guru";
import { PieChart } from "@/components/charts/piechart/PieChart";

export const ClientsPriceCny = (props: {
	showChart: boolean;
	fetchFilteredSalesData: RetailSalesDataResponse[];
}) => {
	const { showChart, fetchFilteredSalesData } = props;
	const width = 900;
	const height = 500;
	const margin = { top: 80, left: 100, right: 100, bottom: 80 };

	/**
	 * convert to array of clients-priceCny objects
	 */
	type ReducedData = { client: string; priceCny: number };
	const reducedData: ReducedData[] = fetchFilteredSalesData.reduce(
		(acc, curr) => {
			const client = curr.client;
			const priceCny = curr.priceCny || 0;
			const existingClient = acc.find((d) => d.client === client);
			if (existingClient) {
				existingClient.priceCny += priceCny;
			} else {
				acc.push({ client, priceCny });
			}
			return acc;
		},
		[] as ReducedData[]
	);

	const [sortState, dispatch] = useReducer(clientsPriceReducer, {
		column: "clients",
		direction: "asc",
	});

	switch (showChart) {
		case true:
			return (
				<div className="relative h-[525px] px-6 py-3 border-t border-neutral-700">
					<PieChart
						data={reducedData}
						svgWidth={width}
						svgHeight={height}
						margin={margin}
						padAngle={0.005}
						valueFormatter={(value, data) => {
							return `¥ ${convertNumberToHumanReadable(value, {
								useComma: true,
								useSuffix: false,
							})}`;
						}}
					/>
				</div>
			);
		case false:
			const sortedData = [...reducedData].sort((a, b) => {
				const { column, direction } = sortState;
				const multiplier = direction === "asc" ? 1 : -1;
				if (column === "clients") {
					return multiplier * a.client.localeCompare(b.client);
				} else if (column === "priceCny") {
					return multiplier * (a.priceCny - b.priceCny);
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
													type: "SORT_BY_CLIENTS",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"clients"
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
													type: "SORT_BY_PRICE_CNY",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column ===
													"priceCny"
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
									<tr key={d.client}>
										<td>{d.client}</td>
										<td>
											¥{" "}
											{convertNumberToHumanReadable(
												d.priceCny,
												{
													useSuffix: false,
													useComma: true,
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
