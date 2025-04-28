"use client";

import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { useEffect, useState } from "react";

/* helper function to generate colors */
const getColor = (index: number): string => {
	const colors = [
		// "#36A2EB",
		// "#FFCE56",
		// "#4BC0C0",
		// "#9966FF",
		// "#FF6384",
		// "#FF9F40",
		"white",
	];
	const colorCount = colors.length;
	/* ensure adjacent arcs don't use the same color */
	const adjustedIndex = (index + Math.floor(index / colorCount)) % colorCount;
	return colors[adjustedIndex];
};

type Datum = {
	[key: string]: string | number;
};

type PieChartProps = {
	/* data array with dynamic keys */
	data: Datum[];
	/* width of the SVG */
	svgWidth: number;
	/* height of the SVG */
	svgHeight: number;
	/* margins */
	margin: { top: number; right: number; bottom: number; left: number };
	/* space between slices */
	padAngle?: number;
	/* callback for hover */
	onMouseEnter?: (index: number, data: Datum) => void;
	/* callback for mouse leave */
	onMouseOut?: (index: number, data: Datum) => void;
	/* optional custom mapping functions */
	textFormatter?: (value: string, data: any) => string;
	valueFormatter?: (value: number, data: any) => string;
};

export const PieChart = ({
	data,
	svgWidth,
	svgHeight,
	margin,
	padAngle = 0.015,
	onMouseEnter,
	onMouseOut,
	textFormatter,
	valueFormatter,
}: PieChartProps) => {
	/* dynamically determine the keys */
	const [stringKey, numberKey] = Object.keys(data[0]);

	const innerWidth = svgWidth - margin.left - margin.right;
	const innerHeight = svgHeight - margin.top - margin.bottom;
	const radius = Math.min(innerWidth, innerHeight) / 2;
	const labelOffset = 30; /* offset distance for the labels */

	/* state to control client-side rendering */
	const [isClient, setIsClient] = useState(false);

	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const totalValue = data.reduce(
		(sum, d) => sum + (d[numberKey] as number),
		0
	);

	useEffect(() => {
		/**
		 * enable rendering on the client
		 * the pie rendering uses cos and sin functions and floating-point arithmetic,
		 * these calculations can produce slightly different results on the server and client.
		 */
		setIsClient(true);
	}, []);

	if (!isClient) {
		/* render a placeholder or nothing on the server */
		return <svg width={svgWidth} height={svgHeight}></svg>;
	}

	return (
		<svg width={svgWidth} height={svgHeight}>
			<rect
				width={svgWidth}
				height={svgHeight}
				className="fill-neutral-900"
				rx={10}
			/>
			<Group top={svgHeight / 2} left={margin.left + radius}>
				<Pie
					data={data}
					pieValue={(d) => d[numberKey] as number}
					outerRadius={radius}
					innerRadius={
						radius * 0.7
					} /* set to 0 for a full pie chart */
					cornerRadius={3}
					padAngle={padAngle} /* space between slices */
				>
					{(pie) =>
						pie.arcs.map((arc, index) => {
							const { startAngle, endAngle } = arc;

							/* align the arc's angle system with Math's angle system */
							const adjustedStartAngle = startAngle - Math.PI / 2;
							const adjustedEndAngle = endAngle - Math.PI / 2;
							const midAngle =
								(adjustedStartAngle + adjustedEndAngle) / 2;

							/* for debugging */
							// console.log(
							// 	arc.data.label,
							// 	radToDeg(startAngle),
							// 	radToDeg(endAngle)
							// );

							const path = pie.path(arc);

							/* calculate label positions relative to the pie chart's center */
							const labelX =
								Math.cos(midAngle) * (radius + labelOffset);
							const labelY =
								Math.sin(midAngle) * (radius + labelOffset);

							return (
								<g
									key={`arc-${index}`}
									onMouseEnter={() => {
										setHoveredIndex(index);
										if (onMouseEnter) {
											onMouseEnter(index, arc.data);
										}
									}}
									onMouseLeave={() => {
										setHoveredIndex(null);
										if (onMouseOut) {
											onMouseOut(index, arc.data);
										}
									}}
									style={{
										transform:
											hoveredIndex === index
												? "scale(1.02)"
												: "scale(1)",
										transformOrigin: "0 0",
										transition: "0.2s ease",
									}}
								>
									<path
										d={path || ""}
										fill={getColor(index)}
										className="opacity-40 hover:opacity-100 transition-opacity duration-200"
									/>
									<text
										x={labelX}
										y={labelY}
										fill="white"
										style={{
											opacity:
												hoveredIndex === index
													? 1
													: 0.4,
											transition: "0.2s ease",
										}}
										fontSize={12}
										textAnchor="middle"
									>
										{textFormatter
											? textFormatter(
													arc.data[
														stringKey
													] as string,
													arc.data
											  )
											: arc.data[stringKey]}
									</text>
								</g>
							);
						})
					}
				</Pie>
			</Group>
			{/* Legend */}
			{hoveredIndex !== null && (
				<foreignObject
					x={svgWidth - margin.right - 200} // Position the legend
					y={margin.top}
					width={180} // Width of the legend
					height={110} // Height of the legend
				>
					<div
						className="p-3
						text-white text-sm
						bg-black bg-opacity-80 rounded-lg"
					>
						<p className="text-base font-bold m-0">
							{textFormatter
								? textFormatter(
										data[hoveredIndex][stringKey] as string,
										data[hoveredIndex]
								  )
								: data[hoveredIndex][stringKey]}
						</p>
						<p className="my-1">
							Value:{" "}
							{valueFormatter
								? valueFormatter(
										data[hoveredIndex][numberKey] as number,
										data[hoveredIndex]
								  )
								: data[hoveredIndex][numberKey]}
						</p>
						<p className="m-0">
							Percentage:{" "}
							{(
								((data[hoveredIndex][numberKey] as number) /
									totalValue) *
								100
							).toFixed(2)}
							%
						</p>
					</div>
				</foreignObject>
			)}
		</svg>
	);
};

const radToDeg = (rad: number): number => (rad * 180) / Math.PI;
