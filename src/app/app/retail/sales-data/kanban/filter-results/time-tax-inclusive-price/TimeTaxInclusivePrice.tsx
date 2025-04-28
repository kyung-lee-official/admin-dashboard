import dayjs from "dayjs";
import { Table, Tbody, Thead } from "@/components/content/Table";
import { useReducer } from "react";
import { RetailSalesDataResponse } from "../../../types";
import { SwapVert } from "../../Icons";
import { timeTaxInclusivePriceSortReducer } from "./timeTaxInclusivePriceSortReducer";
import { convertNumberToHumanReadable } from "num-guru";
import { BarChart } from "@/components/charts/barchart/BarChart";
import { ResultWrapper } from "../ResultWrapper";

export const TimeTaxInclusivePrice = (props: {
	showMonthly: boolean;
	showChartDailySales: boolean;
	fetchFilteredSalesData: RetailSalesDataResponse[];
}) => {
	const width = 900;
	const height = 500;
	const events = false;
	const margin = { top: 80, left: 80, right: 80, bottom: 80 };
	const {
		showMonthly = true,
		showChartDailySales,
		fetchFilteredSalesData,
	} = props;

	const [sortState, dispatch] = useReducer(timeTaxInclusivePriceSortReducer, {
		column: "date",
		direction: "asc",
	});

	type ReducedData = { date: string; taxInclusivePriceCny: number };
	let reducedData: ReducedData[] = [];
	switch (showMonthly) {
		case false:
			reducedData = fetchFilteredSalesData.reduce((acc, curr) => {
				const date = dayjs(curr.date).format("YYYY-MM-DD");
				const taxInclusivePriceCny = curr.taxInclusivePriceCny || 0;
				const existingDate = acc.find((d) => d.date === date);
				if (existingDate) {
					existingDate.taxInclusivePriceCny += taxInclusivePriceCny;
				} else {
					acc.push({
						date,
						taxInclusivePriceCny: taxInclusivePriceCny,
					});
				}
				return acc;
			}, [] as ReducedData[]);
			break;
		case true:
			reducedData = fetchFilteredSalesData.reduce((acc, curr) => {
				const date = dayjs(curr.date).format("YYYY-MM");
				const taxInclusivePriceCny = curr.taxInclusivePriceCny || 0;
				const existingDate = acc.find((d) => d.date === date);
				if (existingDate) {
					existingDate.taxInclusivePriceCny += taxInclusivePriceCny;
				} else {
					acc.push({
						date,
						taxInclusivePriceCny: taxInclusivePriceCny,
					});
				}
				return acc;
			}, [] as ReducedData[]);
			break;

		default:
			break;
	}

	switch (showChartDailySales) {
		case true:
			return (
				<div className="relative h-[525px] px-6 py-3 border-t border-neutral-700">
					{reducedData.length > 0 ? (
						<BarChart
							data={reducedData}
							svgWidth={width}
							svgHeight={height}
							margin={margin}
							textFormatter={(v) => {
								return `¥ ${convertNumberToHumanReadable(v, {
									useComma: true,
									useSuffix: false,
								})}`;
							}}
							axisLeftTickFormatter={(v) => {
								return `¥ ${convertNumberToHumanReadable(v, {
									useComma: true,
									useSuffix: true,
								})}`;
							}}
						/>
					) : (
						<div className="text-center text-white/50">
							No data available to display.
						</div>
					)}
				</div>
			);
		case false:
			const sortedData = [...reducedData].sort((a, b) => {
				const { column, direction } = sortState;
				const multiplier = direction === "asc" ? 1 : -1;
				if (column === "date") {
					return (
						multiplier *
						(dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1)
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
													type: "SORT_BY_DATE",
												});
											}}
										>
											<SwapVert
												size={20}
												direction={
													sortState.column === "date"
														? sortState.direction
														: null
												}
											/>
										</button>
									</div>
								</th>
								<th className="text-left">
									<div className="flex items-center gap-3">
										Tax Inclusive Price{" "}
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
									<tr key={d.date}>
										<td>
											{dayjs(d.date).format(
												"MMM DD, YYYY"
											)}
										</td>
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
				</ResultWrapper>
			);
		default:
			return null;
	}
};
