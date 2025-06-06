import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

type StorehouseExtraCellProps = {
	sku: string;
	storehouse: string;
	type: "availableStock" | "onwayStock" | "inventoryAge";
	enabled: boolean;
	/* Optional prop for staggered loading */
	staggerIndex?: number;
};

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function StorehouseExtraCell({
	sku,
	storehouse,
	type,
	enabled,
	staggerIndex = 0,
}: StorehouseExtraCellProps) {
	const [fetching, setFetching] = useState(false);

	/* Query for stock info (availableStock, onwayStock) */
	const stockQuery = useQuery({
		queryKey: ["stock", sku, storehouse],
		queryFn: async () => {
			await delay(staggerIndex * 1000);
			const res = await axios.post(
				"/api/retail/sales-data/kanban/filter-results/products-sales-volume/inventory-query",
				{
					lstsku: [sku],
					warehouse_code: storehouse,
					page_no: 1,
					page_size: 10,
				}
			);
			return res.data;
		},
		enabled: type !== "inventoryAge" && enabled && fetching,
	});

	const handleMouseEnter = () => setFetching(true);

	/* Query for inventory age */
	const ageQuery = useQuery({
		queryKey: ["inventoryAge", sku, storehouse],
		queryFn: async () => {
			const res = await axios.post(
				"/api/retail/sales-data/kanban/filter-results/products-sales-volume/inventory-age",
				{
					lstsku: [sku],
					warehouse_code: storehouse,
				}
			);
			return res.data;
		},
		enabled: type === "inventoryAge" && enabled && fetching,
	});

	const handleFetch = () => setFetching(true);

	if (!fetching) {
		return (
			<button onClick={handleFetch} disabled={!enabled}>
				Load
			</button>
		);
	}

	if (type === "inventoryAge") {
		if (ageQuery.isLoading) return <span>Loading…</span>;
		if (ageQuery.isError) return <span>Error</span>;
		return <span>{ageQuery.data?.data?.[0]?.inventory_age ?? "-"}</span>;
	} else {
		if (stockQuery.isLoading) return <span>Loading…</span>;
		if (stockQuery.isError) return <span>Error</span>;
		if (type === "availableStock")
			return (
				<span>
					{stockQuery.data?.data?.data?.[0]?.available_stock ?? "-"}
				</span>
			);
		if (type === "onwayStock")
			return (
				<span>
					{stockQuery.data?.data?.data?.[0]?.onway_stock ?? "-"}
				</span>
			);
		return <span>-</span>;
	}

	return null;
}
