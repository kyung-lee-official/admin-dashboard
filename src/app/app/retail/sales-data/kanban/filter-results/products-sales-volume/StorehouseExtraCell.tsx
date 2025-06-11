import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { internalInventoryTo4pxMap } from "../../../inventories";

type StorehouseExtraCellProps = {
	sku: string;
	storehouse: string;
	type: "availableStock" | "onwayStock" | "inventoryAge";
	enabled: boolean;
	/* Optional prop for staggered loading */
	staggerIndex?: number;
};

export function StorehouseExtraCell({
	sku,
	storehouse,
	type,
	enabled,
	staggerIndex = 0,
}: StorehouseExtraCellProps) {
	const [fetching, setFetching] = useState(false);
	const [inventoryInfo, setInventoryInfo] = useState({
		available_stock: 0,
		onway_stock: 0,
		inventory_age: 0,
	});

	/* get the storehouse code array */
	const storehouseCodeArray = internalInventoryTo4pxMap.get(storehouse) ?? [];

	/* Query for stock info (availableStock, onwayStock) */
	const stockQuery = useQuery({
		queryKey: ["stock", sku, storehouse],
		queryFn: async () => {
			const res = await Promise.all(
				storehouseCodeArray.map((code) =>
					axios.post(
						"/api/retail/sales-data/kanban/filter-results/products-sales-volume/inventory-query",
						{
							lstsku: [sku],
							warehouse_code: code,
							page_no: 1,
							page_size: 10,
						}
					)
				)
			);
			for (const i of res) {
				if (i.data?.data?.data.length > 0) {
					const item = i.data.data.data[0];
					setInventoryInfo((prev) => ({
						available_stock:
							prev.available_stock +
							(parseInt(item.available_stock) ?? 0),
						onway_stock:
							prev.onway_stock +
							(parseInt(item.onway_stock) ?? 0),
						inventory_age: prev.inventory_age,
					}));
				}
			}
			return res;
		},
		enabled: type !== "inventoryAge" && enabled,
	});

	const handleMouseEnter = () => setFetching(true);

	/* Query for inventory age */
	const ageQuery = useQuery({
		queryKey: ["inventoryAge", sku, storehouse],
		queryFn: async () => {
			const res = await Promise.all(
				storehouseCodeArray.map((code) => {
					return axios.post(
						"/api/retail/sales-data/kanban/filter-results/products-sales-volume/inventory-age",
						{
							lstsku: [sku],
							warehouse_code: code,
						}
					);
				})
			);
			for (const i of res) {
				if (i.data?.data?.inventorydetaillist.length > 0) {
					const inventoryAgeList =
						i.data.data.inventorydetaillist.map(
							(serial: any, i: number) => {
								return parseInt(serial.inventory_age) || 0;
							}
						);
					const maxInventoryAge = Math.max(
						...inventoryAgeList.filter((age: any) => !isNaN(age))
					);
					setInventoryInfo((prev) => ({
						available_stock: prev.available_stock,
						onway_stock: prev.onway_stock,
						inventory_age: Math.max(
							prev.inventory_age,
							maxInventoryAge
						),
					}));
				}
			}
			return res;
		},
		enabled: type === "inventoryAge" && enabled,
	});

	const handleFetch = () => setFetching(true);

	// if (!fetching) {
	// 	return (
	// 		<button onClick={handleFetch} disabled={!enabled}>
	// 			Load
	// 		</button>
	// 	);
	// }

	if (type === "inventoryAge") {
		if (ageQuery.isLoading) return <span>Loading…</span>;
		if (ageQuery.isError)
			return (
				<span>
					Error{" "}
					<button
						className="ml-2 text-blue-500 underline"
						onClick={() => ageQuery.refetch()}
					>
						Retry
					</button>
				</span>
			);
		return <span>{inventoryInfo.inventory_age ?? "-"}</span>;
	} else {
		if (stockQuery.isLoading) return <span>Loading…</span>;
		if (stockQuery.isError)
			return (
				<span>
					Error{" "}
					<button
						className="ml-2 text-blue-500 underline"
						onClick={() => stockQuery.refetch()}
					>
						Retry
					</button>
				</span>
			);
		if (type === "availableStock")
			return <span>{inventoryInfo.available_stock ?? "-"}</span>;
		if (type === "onwayStock")
			return <span>{inventoryInfo.onway_stock ?? "-"}</span>;
		return <span>-</span>;
	}
}
