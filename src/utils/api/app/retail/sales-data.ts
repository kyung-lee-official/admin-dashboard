import {
	KanbanFilterState,
	Sku,
} from "@/app/app/retail/sales-data/kanban/kanbanFilterReducer";
import {
	ImportRetailSalesData,
	FilteredRetailSalesDataResponse,
} from "@/app/app/retail/sales-data/types";
import axios from "axios";
import pako from "pako";

export enum RetailSalesDataQK {
	GET_SALES_DATA_IMPORT_BATCHES = "get-sales-data-import-batches",
	GET_SALES_DATA_CLIENTS = "get-sales-data-clients",
	GET_SALES_DATA_STOREHOUSES = "get-sales-data-storehouses",
	GET_SALES_DATA_CATEGORIES = "get-sales-data-categories",
	GET_SALES_DATA_RECEIPT_TYPES = "get-sales-data-receipt-types",
	GET_SALES_DATA_SOURCE_ATTRIBUTES = "get-sales-data-source-attributes",
	GET_SALES_DATA_ALL_SKUS = "get-sales-data-all-skus",
}

export async function importRetailSalesData(
	dto: ImportRetailSalesData[],
	jwt: string
) {
	const compressedData = pako.gzip(JSON.stringify(dto));
	// console.log(`Size of compressed data: ${compressedData.length} bytes`);
	const blob = new Blob([compressedData], {
		type: "application/gzip",
	});
	/* create a FormData object and append the file */
	const formData = new FormData();
	formData.append("data", blob);
	/* send the FormData to the backend */

	const res = await axios.post(
		`/internal/retail/sales-data/import`,
		formData,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
				"Content-Type": "multipart/form-data",
			},
		}
	);
	return res.data;
}

export async function getRetailSalesDataImportBatches(
	pageId: number,
	jwt: string
) {
	const res = await axios.get(
		`internal/retail/sales-data/get-batches/${pageId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
				"Content-Type": "application/json",
			},
		}
	);
	return res.data;
}

export async function deleteRetailSalesDataImportBatchById(
	batchId: number,
	jwt: string
) {
	const res = await axios.delete(
		`internal/retail/sales-data/delete-batch-by-id/${batchId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
				"Content-Type": "application/json",
			},
		}
	);
	return res.data;
}

/**
 * @deprecated
 */
export async function getRetailSalesDataClients(jwt: string) {
	const res = await axios.get(`internal/retail/sales-data/get-clients`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
			"Content-Type": "application/json",
		},
	});
	return res.data;
}

/**
 * @deprecated
 */
export async function getRetailSalesDataStorehouses(jwt: string) {
	const res = await axios.get(`internal/retail/sales-data/get-storehouses`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
			"Content-Type": "application/json",
		},
	});
	return res.data;
}

/**
 * @deprecated
 */
export async function getRetailSalesDataCategories(jwt: string) {
	const res = await axios.get(`internal/retail/sales-data/get-categories`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
			"Content-Type": "application/json",
		},
	});
	return res.data;
}

/**
 * @deprecated
 */
export async function getRetailSalesDataReceiptTypes(jwt: string) {
	const res = await axios.get(
		`internal/retail/sales-data/get-receipt-types`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
				"Content-Type": "application/json",
			},
		}
	);
	return res.data;
}

/**
 * @deprecated
 */
export async function getRetailSalesDataSourceAttributes(jwt: string) {
	const res = await axios.get(
		`internal/retail/sales-data/get-source-attributes`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
				"Content-Type": "application/json",
			},
		}
	);
	return res.data;
}

export async function searchRetailSalesDataSku(term: string, jwt: string) {
	const res = await axios.get(
		`internal/retail/sales-data/search-sku/${term}`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
				"Content-Type": "application/json",
			},
		}
	);
	return res.data;
}

export async function getAllSkus(jwt: string): Promise<Sku[]> {
	const res = await axios.get(`internal/retail/sales-data/get-all-skus`, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
			"Content-Type": "application/json",
		},
	});
	return res.data;
}

export async function filterRetailSalesData(
	kfs: KanbanFilterState,
	jwt: string
): Promise<FilteredRetailSalesDataResponse> {
	let dto;
	switch (kfs.dateMode) {
		case "range":
			dto = {
				...kfs,
				dateRange: {
					start: kfs.dateRange.start.toISOString(),
					end: kfs.dateRange.end.toISOString(),
				},
			};
			break;
		case "month":
			dto = kfs;
			break;
		default:
			dto = {};
			break;
	}
	const res = await axios.post(
		`internal/retail/sales-data/filter-sales-data`,
		dto,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
				"Content-Type": "application/json",
			},
		}
	);
	return res.data;
}
