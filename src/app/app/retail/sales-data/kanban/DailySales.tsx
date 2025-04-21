import { RetailSalesDataResponse } from "../types";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Grid } from "@visx/grid";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { AxisLeft } from "@visx/axis";
import dayjs from "dayjs";
import { Table, Tbody, Thead } from "@/components/content/Table";

export const DailySales = (props: {
	showChartDailySales: boolean;
	fetchFilteredSalesData: RetailSalesDataResponse[];
}) => {
	const width = 900;
	const height = 500;
	const events = false;
	const margin = { top: 20, left: 30, right: 0, bottom: 20 };
	const xMax = width;
	const yMax = height - margin.top - margin.bottom;
	const { showChartDailySales, fetchFilteredSalesData } = props;
	/**
	 * convert to array of date-salesVolume objects
	 * accumulate salesVolume for each date
	 */
	const reducedData = fetchFilteredSalesData.reduce((acc, curr) => {
		const date = dayjs(curr.date).format("YYYY-MM-DD");
		const salesVolume = curr.salesVolume;
		const existingDate = acc.find((d) => d.date === date);
		if (existingDate) {
			existingDate.salesVolume += salesVolume;
		} else {
			acc.push({ date, salesVolume });
		}
		return acc;
	}, [] as { date: string; salesVolume: number }[]);
	console.log("reducedData", reducedData);

	/* scales */
	const dateScale = scaleBand<string>({
		range: [0, xMax],
		domain: reducedData.map((d) => d.date),
		padding: 0.1,
	});
	const salesVolumeScale = scaleLinear<number>({
		domain: [
			Math.min(...reducedData.map((d) => d.salesVolume)),
			Math.max(...reducedData.map((d) => d.salesVolume)),
		],
		range: [yMax, 0],
	});

	switch (showChartDailySales) {
		case true:
			return (
				<div className="relative px-6 py-3 border-t border-neutral-700">
					<svg width={width} height={height}>
						<rect
							x={0}
							y={0}
							width={width}
							height={height}
							rx={14}
							className="fill-neutral-700"
						/>
						<Grid
							top={margin.top}
							left={margin.left}
							xScale={dateScale}
							yScale={salesVolumeScale}
							width={width}
							height={height}
							stroke="white"
							strokeOpacity={0.1}
							xOffset={dateScale.bandwidth() / 2}
						/>
						<Group top={margin.top}>
							{reducedData.map((d) => {
								const date = d.date;
								const barWidth = dateScale.bandwidth() * 0.2;
								const barHeight =
									yMax - salesVolumeScale(d.salesVolume);
								const barX = dateScale(date) ?? 0;
								const barY = yMax - barHeight;
								return (
									<Bar
										key={`bar-${date}`}
										x={barX + margin.left}
										y={barY}
										width={barWidth}
										height={barHeight}
										className="fill-neutral-500"
										onClick={() => {
											if (events)
												alert(
													`clicked: ${JSON.stringify(
														Object.values(d)
													)}`
												);
										}}
									/>
								);
							})}
							<AxisLeft
								scale={salesVolumeScale}
								left={margin.left}
								stroke="white"
								tickStroke="white"
								tickLabelProps={() => ({
									fill: "white",
									fontSize: 11,
									textAnchor: "end",
								})}
								hideAxisLine
								hideTicks={false}
							/>
						</Group>
					</svg>
				</div>
			);
		case false:
			return (
				<Table>
					<Thead>
						<tr>
							<th className="text-left">
								Date ({reducedData.length})
							</th>
							<th className="text-left">Sales Volume</th>
						</tr>
					</Thead>
					<Tbody>
						{reducedData.map((d) => {
							return (
								<tr key={d.date}>
									<td>
										{dayjs(d.date).format("MMM DD, YYYY")}
									</td>
									<td>{d.salesVolume}</td>
								</tr>
							);
						})}
					</Tbody>
				</Table>
			);
		default:
			return null;
	}
};
