import { Table, Tbody, Thead } from "@/components/content/Table";
import { RetailSalesDataResponse } from "../../../types";
import { useReducer } from "react";
import { SwapVert } from "../../Icons";
import { clientsTaxInclusivePriceCnyReducer } from "./clientsTaxInclusivePriceReducer";
import { convertNumberToHumanReadable } from "num-guru";
import { PieChart } from "@/components/charts/piechart/PieChart";
import { ResultWrapper } from "../ResultWrapper";

export const ClientsTaxInclusivePriceCny = (props: {
	showChart: boolean;
	fetchFilteredSalesData: RetailSalesDataResponse[];
}) => {
	const { showChart, fetchFilteredSalesData } = props;
	const width = 900;
	const height = 500;
	const margin = { top: 80, left: 100, right: 100, bottom: 80 };

	/**
	 * convert to array of clients-taxInclusivePriceCny objects
	 */
	type ReducedData = { client: string; taxInclusivePriceCny: number };
	const reducedData: ReducedData[] = fetchFilteredSalesData.reduce(
		(acc, curr) => {
			const client = curr.client;
			const taxInclusivePriceCny = curr.taxInclusivePriceCny || 0;
			const existingClient = acc.find((d) => d.client === client);
			if (existingClient) {
				existingClient.taxInclusivePriceCny += taxInclusivePriceCny;
			} else {
				acc.push({ client, taxInclusivePriceCny });
			}
			return acc;
		},
		[] as ReducedData[]
	);
	const totalGmv = reducedData.reduce(
		(acc, curr) => acc + curr.taxInclusivePriceCny,
		0
	);

	const [sortState, dispatch] = useReducer(
		clientsTaxInclusivePriceCnyReducer,
		{
			column: "clients",
			direction: "asc",
		}
	);

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
						textFormatter={(value, data) => {
							const percentage = (
								(Number(data.taxInclusivePriceCny) / totalGmv) *
								100
							).toFixed(2);
							return `${data.client}, ${percentage}%`;
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
				} else if (column === "taxInclusivePriceCny") {
					return (
						multiplier *
						(a.taxInclusivePriceCny - b.taxInclusivePriceCny)
					);
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
										Clients ({reducedData.length}){" "}
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
													type: "SORT_BY_TAX_INCLUSIVE_PRICE_CNY",
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
									<tr key={d.client}>
										<td>{d.client}</td>
										<td>
											¥{" "}
											{convertNumberToHumanReadable(
												d.taxInclusivePriceCny,
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
				</ResultWrapper>
			);
		default:
			return null;
	}
};
