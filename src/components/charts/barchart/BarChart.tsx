"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { Grid } from "@visx/grid";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Text } from "@visx/text";

type BarChartProps = {
	data: {
		[key: string]: string | number;
	}[] /* data array with dynamic keys */;
	svgWidth: number /* width of the svg */;
	svgHeight: number /* height of the svg */;
	margin: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	} /* chart margins */;
};

export const BarChart = ({
	data,
	svgWidth,
	svgHeight,
	margin,
}: BarChartProps) => {
	/* dynamically determine the keys */
	const [stringKey, numberKey] = Object.keys(data[0]);

	/**
	 * https://airbnb.io/visx/docs/scale
	 * https://d3js.org/d3-scale/band
	 */
	/* create scales */
	const xScale = scaleBand({
		domain: data.map((d) => d[stringKey] as string),
		range: [0, svgWidth - margin.left - margin.right],
		padding: 0.6,
	});

	const yScale = scaleLinear({
		domain: [
			Math.min(...data.map((d) => d[numberKey] as number), 0),
			Math.max(...data.map((d) => d[numberKey] as number), 0),
		],
		range: [svgHeight - margin.top - margin.bottom, 0],
	});

	return (
		<svg width={svgWidth} height={svgHeight}>
			<rect
				width={svgWidth}
				height={svgHeight}
				className="fill-neutral-900"
				rx={10}
			/>
			{/* https://airbnb.io/visx/docs/group */}
			<Group top={margin.top} left={margin.left}>
				<Grid
					top={0} /* it's already inside the Group */
					left={0} /* it's already inside the Group */
					xScale={xScale}
					yScale={yScale}
					width={svgWidth - margin.left - margin.right}
					height={svgHeight - margin.top - margin.bottom}
					stroke="white"
					strokeOpacity={0.3}
				/>
				{data.map((d) => {
					const barWidth = xScale.bandwidth();
					const barX = xScale(d[stringKey] as string) ?? 0;

					/* calculate the y position and height dynamically based on whether the value is positive or negative. */
					const barY0 = yScale(0);
					const barHeight = Math.abs(
						barY0 - yScale(d[numberKey] as number)
					);
					const barY =
						(d[numberKey] as number) > 0
							? barY0 - barHeight
							: barY0;

					/* calculate the position for the text */
					/* adjust offset for positive/negative bars */
					const textY =
						(d[numberKey] as number) > 0
							? barY - 5
							: barY + barHeight + 15;
					/* center the text horizontally */
					const textX = barX + barWidth / 2;

					return (
						<g key={`bar-group-${d[stringKey]}`}>
							<Bar
								x={barX}
								width={barWidth}
								y={barY}
								height={barHeight}
								className={
									(d[numberKey] as number) > 0
										? "fill-neutral-400"
										: "fill-neutral-600"
								}
							/>
							<Text
								x={textX}
								y={textY}
								/* center the text horizontally */
								textAnchor="middle"
								/* text color */
								fill="white"
								/* adjust font size as needed */
								fontSize={12}
							>
								{d[numberKey]}
							</Text>
						</g>
					);
				})}
				<AxisLeft
					left={0} /* it's already inside the Group */
					/* use the yScale for the y-axis */
					scale={yScale}
					/* axis line color */
					stroke="white"
					/* tick color */
					tickStroke="white"
					/* format the tick values */
					tickFormat={(d) => d.toString()}
					tickLabelProps={() => ({
						/* tick label color */
						fill: "white",
						/* font size for tick labels */
						fontSize: 12,
						/* align the labels to the right */
						textAnchor: "end",
						/* move the labels slightly to the left */
						dx: -5,
					})}
				/>
				<AxisBottom
					/* position the axis at the bottom of the chart */
					top={svgHeight - margin.bottom - margin.top}
					left={0} /* it's already inside the Group */
					/* use the xScale for the x-axis */
					scale={xScale}
					/* axis line color */
					stroke="white"
					/* tick color */
					tickStroke="white"
					/* map the string key to desired format */
					tickFormat={(d) => {
						return d;
					}}
					tickLabelProps={() => ({
						/* tick label color */
						fill: "white",
						/* font size for tick labels */
						fontSize: 12,
						/* center the labels */
						textAnchor: "middle",
						/* move the labels down */
						dy: 10,
					})}
				/>
			</Group>
		</svg>
	);
};
