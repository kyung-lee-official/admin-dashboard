"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import {
	DateRange,
	DateRangePicker,
} from "@/components/date/date-range-picker/DateRangePicker";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { Dropdown as OnlineDropdown } from "@/components/input/online-dropdown/Dropdown";
import { useAuthStore } from "@/stores/auth";
import {
	getRetailSalesDataCategories,
	getRetailSalesDataClients,
	getRetailSalesDataSearchSku,
	getRetailSalesDataStorehouses,
	RetailSalesDataQK,
} from "@/utils/api/app/retail/sales-data";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.RETAIL_IMPORT_SALES_DATA,
	});
	const [range, setRange] = useState<DateRange>({
		start: dayjs().subtract(1, "month"),
		end: dayjs(),
	});
	type Sku = {
		id: number;
		sku: string;
		nameZhCn: string;
	};
	const [sku, setSku] = useState<Sku | Sku[] | null>(null);

	const jwt = useAuthStore((state) => state.jwt);
	const getRetailSalesDataClientsQuery = useQuery<any, AxiosError>({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_CLIENTS],
		queryFn: async () => {
			const clients = await getRetailSalesDataClients(jwt);
			return clients;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});
	const getRetailSalesDataStorehousesQuery = useQuery<any, AxiosError>({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_STOREHOUSES],
		queryFn: async () => {
			const storehouses = await getRetailSalesDataStorehouses(jwt);
			return storehouses;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});
	const getRetailSalesDataCategoriesQuery = useQuery<any, AxiosError>({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_CATEGORIES],
		queryFn: async () => {
			const categories = await getRetailSalesDataCategories(jwt);
			return categories;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	// const searchSkuMutation = useMutation({
	// 	mutationFn: async (term: string) => {},
	// 	onSuccess: (data) => {},
	// 	onError: (error) => {
	// 		console.error(error);
	// 	},
	// });

	async function handleSearchSku(term: string) {
		const sku = await getRetailSalesDataSearchSku(term, jwt);
		return sku;
	}
	/* function to handle deselection of an sku */
	const handleDeselect = (option: Sku) => {
		if (Array.isArray(sku)) {
			setSku(sku.filter((s) => s.id !== option.id));
		}
	};

	return (
		<PageContainer>
			<PageBlock title={"Kanban"}>
				<div
					className="px-6 py-3
					border-t border-neutral-700"
				>
					<DateRangePicker range={range} setRange={setRange} />
					{/* {searchSkuMutation.data && (
						<Dropdown<Sku>
							placeholder="Search for an option..."
							selected={sku}
							setSelected={setSku}
							endpoint={`${process.env.NEXT_PUBLIC_NESTJS}/mock-data/online-dropdown`}
							labelKey="nameZhCn"
						/>
					)} */}
				</div>
			</PageBlock>
			<PageBlock title={"Clients"}>
				<div
					className="flex flex-wrap px-6 py-3 gap-1.5
					border-t border-neutral-700"
				>
					{getRetailSalesDataClientsQuery.data &&
						getRetailSalesDataClientsQuery.data.map((c: any) => {
							return (
								<button
									key={c.id}
									className="px-1
									text-sm
									border border-neutral-700
									rounded cursor-pointer"
								>
									{c.client}
								</button>
							);
						})}
				</div>
			</PageBlock>
			<PageBlock title={"Storehouses"}>
				<div
					className="flex flex-wrap px-6 py-3 gap-1.5
					border-t border-neutral-700"
				>
					{getRetailSalesDataStorehousesQuery.data &&
						getRetailSalesDataStorehousesQuery.data.map(
							(s: any) => {
								return (
									<button
										key={s.id}
										className="px-1
										text-sm
										border border-neutral-700
										rounded cursor-pointer"
									>
										{s.storehouse}
									</button>
								);
							}
						)}
				</div>
			</PageBlock>
			<PageBlock title={"Categories"}>
				<div
					className="flex flex-wrap px-6 py-3 gap-1.5
					border-t border-neutral-700"
				>
					{getRetailSalesDataCategoriesQuery.data &&
						getRetailSalesDataCategoriesQuery.data.map((c: any) => {
							return (
								<button
									key={c.id}
									className="px-1
									text-sm
									border border-neutral-700
									rounded cursor-pointer"
								>
									{c.category}
								</button>
							);
						})}
				</div>
			</PageBlock>
			<PageBlock
				title={
					<div className="flex items-center gap-2">
						<div>SKU</div>
						<OnlineDropdown<Sku>
							placeholder="Search SKU..."
							selected={sku}
							setSelected={setSku}
							multiple
							fetchOptions={handleSearchSku}
							labelKey="nameZhCn"
							renderOption={(option) => (
								<div
									className="flex flex-col
									text-xs text-neutral-400"
								>
									<span>{option.nameZhCn}</span>
									<span>{option.sku}</span>
								</div>
							)}
						/>
					</div>
				}
			>
				<div
					className="flex flex-wrap px-6 py-3 gap-1.5
					border-t border-neutral-700"
				>
					{sku &&
						(sku as Sku[]).map((s: Sku) => {
							return (
								<button
									key={s.id}
									onClick={() => handleDeselect(s)}
									className="flex flex-col items-start px-1
									text-xs text-neutral-400 hover:line-through
									border border-neutral-700 cursor-pointer"
								>
									<span>{s.nameZhCn}</span>
									<span>{s.sku}</span>
								</button>
							);
						})}
				</div>
			</PageBlock>
		</PageContainer>
	);
};
