import { RetailSalesData } from "@/app/app/retail/sales-data/types";
import axios from "axios";
import pako from "pako";

export enum RetailSalesDataQK {
	GET_SALES_DATA_IMPORT_BATCHES = "get-sales-data-import-batches",
}

export async function importRetailSalesData(
	dto: RetailSalesData[],
	jwt: string
) {
	const compressedData = pako.gzip(JSON.stringify(dto));
	console.log(`Size of compressed data: ${compressedData.length} bytes`);
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
	if (!res) {
		throw new Error("Failed to import sales data");
	}
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
	if (!res) {
		throw new Error("Failed to get sales data import batches");
	}
	return res.data;
}

export async function deleteRetailSalesDataImportBatchById(jwt: string) {
	const res = await axios.delete(
		`internal/retail/sales-data/delete-batch-by-id`,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
				"Content-Type": "application/json",
			},
		}
	);
	if (!res) {
		throw new Error("Failed to delete sales data import batch");
	}
	return res.data;
}
