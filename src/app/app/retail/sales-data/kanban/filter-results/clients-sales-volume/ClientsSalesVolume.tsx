import { Table, Tbody, Thead } from "@/components/content/Table";
import { RetailSalesDataResponse } from "../../../types";
import { useReducer } from "react";
import { SwapVert } from "../../Icons";
import { clientsSalesVolumeReducer } from "./clientsSalesVolumeReducer";

export const ClientsSalesVolume = (props: {
	showChart: boolean;
	fetchFilteredSalesData: RetailSalesDataResponse[];
}) => {
	const { showChart, fetchFilteredSalesData } = props;

	/**
	 * convert to array of clients-salesVolume objects
	 */
	type ReducedData = { client: string; salesVolume: number };
	const reducedData: ReducedData[] = fetchFilteredSalesData.reduce(
		(acc, curr) => {
			const client = curr.client;
			const salesVolume = curr.salesVolume;
			const existingClient = acc.find((d) => d.client === client);
			if (existingClient) {
				existingClient.salesVolume += salesVolume;
			} else {
				acc.push({ client, salesVolume });
			}
			return acc;
		},
		[] as ReducedData[]
	);

	const [sortState, dispatch] = useReducer(clientsSalesVolumeReducer, {
		column: "clients",
		direction: "asc",
	});

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
				if (column === "clients") {
					return multiplier * a.client.localeCompare(b.client);
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
									<tr key={d.client}>
										<td>{d.client}</td>
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
