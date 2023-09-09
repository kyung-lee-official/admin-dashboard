import { scale } from "@/utilities/math/math";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import topojson from "./topojson.json";
import {
	Bar,
	ComposedChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

type Feedback = {
	id: string;
	pageId: string;
	url: string;
	payload: "USEFUL" | "USELESS";
	ip: string;
	country: string;
	createdDate: string;
	updatedDate: string;
};

type TopoGeoProperties = {
	name: string;
	"Alpha-2": string | null;
};

type GeoInfo = {
	geoName: string /* Country name, from topojson */;
	alpha2: string | null /* Alpha-2 code */;
	feedbackCount: number /* Total feedbacks */;
	usefulCount: number /* Total usefuls */;
	uselessCount: number /* Total uselesses */;
};

type PageInfo = {
	pageId: string;
	feedbackCount: number;
	usefulCount: number;
	uselessCount: number;
};

export const Geo = (props: any) => {
	const feedbacks: Feedback[] = props.feedbacks;
	const topoGeoInfos: TopoGeoProperties[] =
		topojson.objects.countries1.geometries.map((geometry) => {
			return geometry.properties;
		});
	const [geoInfos, setGeoInfos] = useState<GeoInfo[]>([]);
	const [top15GeoInfos, setTop15GeoInfos] = useState<GeoInfo[]>([]);
	const [activeAlpha2, setActiveAlpha2] = useState<string>("");
	const [activeGeoInfo, setActiveGeoInfo] = useState<GeoInfo | null>(null);
	const [isInfoCardVisible, setIsInfoCardVisible] = useState<boolean>(false);
	const [geoUsefulUseless, setGeoUsefulUseless] = useState<
		"all" | "useful" | "useless"
	>("all");
	const [pageInfos, setPageInfos] = useState<any[]>([]);
	const [pageUsefulUseless, setPageUsefulUseless] = useState<
		"all" | "useful" | "useless"
	>("all");

	const fillCyan: any = {
		"100": "#cffafe",
		"200": "#a5f3fc",
		"300": "#67e8f9",
		"400": "#22d3ee",
		"500": "#06b6d4",
		"600": "#0891b2",
		"700": "#0e7490",
		"800": "#155e75",
		"900": "#164e63",
	};

	function onGeoUsefulUselessChange(e: any) {
		setGeoUsefulUseless(e.target.value);
	}

	function onPageUsefulUselessChange(e: any) {
		setPageUsefulUseless(e.target.value);
	}

	useEffect(() => {
		if (feedbacks) {
			/* GeoInfos */
			const generatedGeoInfos = topoGeoInfos.map(
				(geoProps: TopoGeoProperties) => {
					const feedbacksOfThisGeo: any[] = feedbacks.filter(
						(feedback: any) =>
							feedback.country === geoProps["Alpha-2"]
					);
					return {
						geoName:
							geoProps.name === "Taiwan"
								? "Taiwan, China"
								: geoProps.name,
						alpha2: geoProps["Alpha-2"],
						feedbackCount: feedbacksOfThisGeo.length,
						usefulCount: feedbacksOfThisGeo.filter(
							(feedback: any) => feedback.payload === "USEFUL"
						).length,
						uselessCount: feedbacksOfThisGeo.filter(
							(feedback: any) => feedback.payload === "USELESS"
						).length,
					};
				}
			);
			setGeoInfos(generatedGeoInfos);
			const top15GeoInfos = generatedGeoInfos
				.sort((a, b) => {
					if (a.feedbackCount > b.feedbackCount) {
						return -1;
					}
					if (a.feedbackCount < b.feedbackCount) {
						return 1;
					}
					return 0;
				})
				.slice(0, 15);
			setTop15GeoInfos(top15GeoInfos);

			/* Page Infos */
			const generatedPageInfos = feedbacks.reduce(
				(acc: PageInfo[], curr: Feedback) => {
					const infoOfThisPage = acc.find(
						(pageInfo: PageInfo) => pageInfo.pageId === curr.pageId
					);
					if (infoOfThisPage) {
						infoOfThisPage.feedbackCount++;
						if (curr.payload === "USEFUL") {
							infoOfThisPage.usefulCount++;
						} else {
							infoOfThisPage.uselessCount++;
						}
					} else {
						acc.push({
							pageId: curr.pageId,
							feedbackCount: 1,
							usefulCount: curr.payload === "USEFUL" ? 1 : 0,
							uselessCount: curr.payload === "USELESS" ? 1 : 0,
						});
					}
					return acc;
				},
				[]
			);
			setPageInfos(
				generatedPageInfos.sort((a, b) => {
					if (a.feedbackCount > b.feedbackCount) {
						return -1;
					}
					if (a.feedbackCount < b.feedbackCount) {
						return 1;
					}
					return 0;
				})
			);
		}
	}, [feedbacks]);

	useEffect(() => {
		const infoOfThisGeo = geoInfos.find(
			(geoInfo: GeoInfo) => geoInfo.alpha2 === activeAlpha2
		);
		if (infoOfThisGeo) {
			setIsInfoCardVisible(true);
			setActiveGeoInfo(infoOfThisGeo);
		} else {
			setActiveGeoInfo(null);
		}
	}, [activeAlpha2]);

	useEffect(() => {
		switch (geoUsefulUseless) {
			case "all":
				setTop15GeoInfos(
					geoInfos
						.sort((a, b) => {
							if (a.feedbackCount > b.feedbackCount) {
								return -1;
							}
							if (a.feedbackCount < b.feedbackCount) {
								return 1;
							}
							return 0;
						})
						.slice(0, 15)
				);
				break;
			case "useful":
				setTop15GeoInfos(
					geoInfos
						.sort((a, b) => {
							if (a.usefulCount > b.usefulCount) {
								return -1;
							}
							if (a.usefulCount < b.usefulCount) {
								return 1;
							}
							return 0;
						})
						.slice(0, 15)
				);
				break;
			case "useless":
				setTop15GeoInfos(
					geoInfos
						.sort((a, b) => {
							if (a.uselessCount > b.uselessCount) {
								return -1;
							}
							if (a.uselessCount < b.uselessCount) {
								return 1;
							}
							return 0;
						})
						.slice(0, 15)
				);
				break;
			default:
				break;
		}
	}, [geoUsefulUseless]);

	useEffect(() => {
		switch (pageUsefulUseless) {
			case "all":
				setPageInfos(
					pageInfos
						.sort((a, b) => {
							if (a.feedbackCount > b.feedbackCount) {
								return -1;
							}
							if (a.feedbackCount < b.feedbackCount) {
								return 1;
							}
							return 0;
						})
						.slice(0, 15)
				);
				break;
			case "useful":
				setPageInfos(
					pageInfos
						.sort((a, b) => {
							if (a.usefulCount > b.usefulCount) {
								return -1;
							}
							if (a.usefulCount < b.usefulCount) {
								return 1;
							}
							return 0;
						})
						.slice(0, 15)
				);
				break;
			case "useless":
				setPageInfos(
					pageInfos
						.sort((a, b) => {
							if (a.uselessCount > b.uselessCount) {
								return -1;
							}
							if (a.uselessCount < b.uselessCount) {
								return 1;
							}
							return 0;
						})
						.slice(0, 15)
				);
				break;
			default:
				break;
		}
	}, [pageUsefulUseless]);

	return (
		<div className="flex-1 flex flex-col items-center gap-8">
			<h1 className="text-5xl">Overview</h1>
			<div
				className="w-3/5 px-8
				bg-gray-500
				dark:bg-slate-900
				rounded-xl shadow-lg"
			>
				<ComposableMap>
					<Geographies geography={topojson}>
						{({ geographies }) => {
							const styledGeographies = geographies.map(
								(geo, index) => {
									const infoOfThisGeo = geoInfos.find(
										(geoInfo: GeoInfo) =>
											geoInfo.alpha2 ===
											geo.properties["Alpha-2"]
									);
									const minScale = 1;
									const maxScale = 9;
									let colorScale: number = minScale;
									if (infoOfThisGeo) {
										colorScale = scale(
											(infoOfThisGeo as GeoInfo)
												.feedbackCount,
											0,
											feedbacks.length,
											minScale,
											maxScale
										);
									} else {
										colorScale = minScale;
									}
									let intColorScale = Math.floor(colorScale);
									return (
										<Geography
											key={geo.rsmKey}
											geography={geo}
											fill={
												fillCyan[
													intColorScale.toString() +
														"00"
												]
											}
											style={{
												default: {
													outline: "none",
												},
												pressed: {
													outline: "none",
												},
												hover: {
													fill: "#14b8a6",
													outline: "none",
													transition: "all 300ms",
												},
											}}
											onMouseEnter={() => {
												setActiveAlpha2(
													geo.properties["Alpha-2"]
												);
											}}
										/>
									);
								}
							);
							return styledGeographies;
						}}
					</Geographies>
				</ComposableMap>
			</div>
			{isInfoCardVisible && (
				<motion.div
					initial={{ opacity: 0, y: -40, scaleY: 0.5 }}
					animate={{
						opacity: 1,
						y: 0,
						scaleY: 1,
						transition: {
							duration: 0.5,
							type: "spring",
							stiffness: 100,
						},
					}}
					className="w-3/5 min-h-[120px] px-8 py-4 origin-top flex flex-col gap-4
					text-gray-200
					bg-gray-500 dark:bg-slate-900
					rounded-xl shadow-lg"
				>
					<div className="flex justify-center items-center text-3xl">
						{activeGeoInfo ? activeGeoInfo.geoName : ""}
					</div>
					<div className="flex justify-between items-center text-lg gap-10">
						<div>
							{activeGeoInfo
								? `Feedbacks: ${activeGeoInfo.feedbackCount}`
								: ""}
						</div>
						<div
							className="flex-1 flex justify-between items-center gap-4
							font-semibold text-base"
						>
							<div>
								👍🏼 Useful {`(${activeGeoInfo?.usefulCount})`}
							</div>
							<div
								className="flex-1 flex justify-between
								bg-slate-400
								rounded-full shadow-md overflow-hidden"
							>
								<motion.div
									layout
									initial={{
										backgroundColor: "#a3e635",
										height: 10,
										flexGrow: 1,
									}}
									animate={{
										flexGrow:
											activeGeoInfo?.usefulCount || 0,
										transition: {
											duration: 0.3,
										},
									}}
								></motion.div>
								{activeGeoInfo?.usefulCount === 0 ||
								activeGeoInfo?.uselessCount === 0 ? null : (
									<motion.div className="flex-[0_0_40px] h-[10px] bg-gradient-to-r from-lime-400 to-red-400"></motion.div>
								)}
								<motion.div
									layout
									initial={{
										backgroundColor: "#f87171",
										height: 10,
										flexGrow: 1,
									}}
									animate={{
										flexGrow:
											activeGeoInfo?.uselessCount || 0,
										transition: {
											duration: 0.3,
										},
									}}
								></motion.div>
							</div>
							<div>
								👎🏼 Useless {`(${activeGeoInfo?.uselessCount})`}
							</div>
						</div>
					</div>
				</motion.div>
			)}
			{top15GeoInfos && (
				<motion.div
					initial={{ opacity: 0, y: -40, scaleY: 0.5 }}
					animate={{
						opacity: 1,
						y: 0,
						scaleY: 1,
						transition: {
							duration: 0.5,
							type: "spring",
							stiffness: 100,
						},
					}}
					className="w-3/5 min-h-[120px] px-8 pt-4 pb-8 origin-top flex flex-col gap-4
					text-gray-200
					bg-gray-500 dark:bg-slate-900
					rounded-xl shadow-lg"
				>
					<div className="flex justify-center items-center gap-12">
						<div className="text-3xl">Ranking</div>
						<div className="flex justify-center items-center gap-4">
							<div>
								<label className="flex gap-1">
									<input
										type="radio"
										name="geoRanking"
										value="all"
										onChange={onGeoUsefulUselessChange}
										defaultChecked={true}
									/>
									All
								</label>
							</div>
							<div>
								<label className="flex gap-1">
									<input
										type="radio"
										name="geoRanking"
										value="useful"
										onChange={onGeoUsefulUselessChange}
									/>
									Useful
								</label>
							</div>
							<div>
								<label className="flex gap-1">
									<input
										type="radio"
										name="geoRanking"
										value="useless"
										onChange={onGeoUsefulUselessChange}
									/>
									Useless
								</label>
							</div>
						</div>
					</div>
					<div className="min-h-[800px] flex justify-between items-center text-lg gap-10">
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart
								data={top15GeoInfos}
								margin={{
									top: 10,
									right: 20,
									bottom: 10,
									left: 10,
								}}
								layout="vertical"
							>
								<XAxis
									type="number"
									hide
									minTickGap={50}
								></XAxis>
								<YAxis
									type="category"
									dataKey={"alpha2"}
									style={{ fill: "#d1d5db" }}
									interval={0}
									tickMargin={10}
								></YAxis>
								{(geoUsefulUseless === "all" ||
									geoUsefulUseless === "useful") && (
									<Bar
										dataKey="usefulCount"
										stackId="a"
										fill={"#a3e635"}
										barSize={12}
									></Bar>
								)}
								{(geoUsefulUseless === "all" ||
									geoUsefulUseless === "useless") && (
									<Bar
										dataKey="uselessCount"
										stackId="a"
										fill={"#f87171"}
										barSize={12}
									></Bar>
								)}
							</ComposedChart>
						</ResponsiveContainer>
					</div>
				</motion.div>
			)}
			<h1 className="text-5xl">Page Data</h1>
			<div
				className="w-3/5 min-h-[800px] flex flex-col justify-start items-between px-8 py-4 gap-6
				text-gray-200
				bg-gray-500 dark:bg-slate-900
				rounded-xl shadow-lg"
			>
				<div className="flex justify-center items-center gap-12">
					<div className="text-3xl">Ranking</div>
					<div className="flex justify-center items-center gap-4">
						<div>
							<label className="flex gap-1">
								<input
									type="radio"
									name="pageRanking"
									value="all"
									onChange={onPageUsefulUselessChange}
									defaultChecked={true}
								/>
								All
							</label>
						</div>
						<div>
							<label className="flex gap-1">
								<input
									type="radio"
									name="pageRanking"
									value="useful"
									onChange={onPageUsefulUselessChange}
								/>
								Useful
							</label>
						</div>
						<div>
							<label className="flex gap-1">
								<input
									type="radio"
									name="pageRanking"
									value="useless"
									onChange={onPageUsefulUselessChange}
								/>
								Useless
							</label>
						</div>
					</div>
				</div>
				{pageInfos &&
					pageInfos.map((pageInfo: PageInfo, index: number) => {
						return (
							<div
								className="flex flex-col w-full gap-1 p-3
								text-gray-400 bg-gray-600
								rounded-md shadow-md"
								key={`page-info-${index}`}
							>
								<div>Page ID: {pageInfo.pageId}</div>
								<div className="flex justify-between">
									<div className="text-lime-400">
										Useful: {pageInfo.usefulCount}
									</div>
									<div>Total: {pageInfo.feedbackCount}</div>
									<div className="text-red-400">
										Useless: {pageInfo.uselessCount}
									</div>
								</div>
								<div
									className="w-full h-[10px] flex
									bg-slate-400
									rounded-full shadow-md overflow-hidden"
								>
									{
										<motion.div
											initial={{
												backgroundColor: "#a3e635",
												flexGrow: 1,
											}}
											animate={{
												flexGrow:
													pageUsefulUseless ===
														"all" ||
													pageUsefulUseless ===
														"useful"
														? pageInfo.usefulCount
														: 0,
											}}
										></motion.div>
									}
									{
										<motion.div
											initial={{
												backgroundColor: "#f87171",
												flexGrow: 1,
											}}
											animate={{
												flexGrow:
													pageUsefulUseless ===
														"all" ||
													pageUsefulUseless ===
														"useless"
														? pageInfo.uselessCount
														: 0,
											}}
										></motion.div>
									}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};
