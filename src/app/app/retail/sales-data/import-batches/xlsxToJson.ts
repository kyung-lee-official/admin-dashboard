import * as ExcelJS from "exceljs";
import { RetailSalesData, retailSalesDataSchema } from "../types";
import { parseHumanReadableNumber } from "human-readable-to-number";
import dayjs from "dayjs";

export async function xlsxToJson(file: File): Promise<RetailSalesData[]> {
	return new Promise(async (resolve, reject) => {
		const reader = new FileReader();
		const json: RetailSalesData[] = [];

		reader.onload = async (e) => {
			try {
				const buffer = reader.result as ArrayBuffer;
				const workbook = new ExcelJS.Workbook();
				await workbook.xlsx.load(buffer);
				const sheet = workbook.getWorksheet("源数据");

				if (sheet) {
					for (let i = 2; i <= sheet.rowCount; i++) {
						const row = sheet.getRow(i);
						// console.log(
						// 	i,
						// 	row.getCell(1).text,
						// 	row.getCell(2).text,
						// 	dayjs(row.getCell(2).text)
						// );

						/* ignore empty row */
						if (!row.getCell("C").text) {
							console.error(
								`Error at row ${i}, invalid data format, row ignored`
							);
							continue;
						}

						try {
							const date = dayjs(
								row.getCell("C").text as string
							).toISOString();
							const receiptType = row.getCell("D").text as string;
							const client = row.getCell("E").text as string;
							const department = row.getCell("F").text as string;
							const sku = row.getCell("G").text as string;
							const nameZhCn = row.getCell("H").text as string;
							const salesVolume = parseFloat(
								row.getCell("I").text as string
							);
							/* platform address */
							const platformAddressText = row.getCell("J")
								.text as string;
							/* debug */
							// console.log(
							// 	sku,
							// 	"platformAddressText",
							// 	platformAddressText,
							// 	platformAddressText === ""
							// );

							const platformAddress =
								platformAddressText === ""
									? null
									: platformAddressText;
							const platformOrderId = row.getCell("K")
								.text as string;
							const storehouse = row.getCell("L").text as string;
							const category = row.getCell("M").text as string;
							/* tax inclusive price in CNY */
							const taxInclusivePriceCnyText = row.getCell("N")
								.text as string;
							const parsedTaxInclusivePriceCnyText =
								parseHumanReadableNumber(
									taxInclusivePriceCnyText
								);
							const taxInclusivePriceCny = isNaN(
								parsedTaxInclusivePriceCnyText
							)
								? null
								: parsedTaxInclusivePriceCnyText;
							/* price in CNY */
							const priceCnyText = row.getCell("P")
								.text as string;
							const parsedPriceCnyText =
								parseHumanReadableNumber(priceCnyText);
							const priceCny = isNaN(parsedPriceCnyText)
								? null
								: parsedPriceCnyText;
							/* unit price in CNY */
							const unitPriceCnyText = row.getCell("R")
								.text as string;
							const parsedUnitPriceCnyText =
								parseHumanReadableNumber(unitPriceCnyText);
							const unitPriceCny = isNaN(parsedUnitPriceCnyText)
								? null
								: parsedUnitPriceCnyText;

							retailSalesDataSchema.parse({
								date: date,
								receiptType: receiptType,
								client: client,
								department: department,
								sku: sku,
								nameZhCn: nameZhCn,
								salesVolume: salesVolume,
								platformAddress: platformAddress,
								platformOrderId: platformOrderId,
								storehouse: storehouse,
								category: category,
								taxInclusivePriceCny: taxInclusivePriceCny,
								priceCny: priceCny,
								unitPriceCny: unitPriceCny,
							});

							json.push({
								date: dayjs(
									date
								).toISOString() /* treat date as local time and convert to UTC */,
								receiptType: receiptType,
								client: client,
								department: department,
								sku: sku,
								nameZhCn: nameZhCn,
								salesVolume: salesVolume,
								platformAddress: platformAddress,
								platformOrderId: platformOrderId,
								storehouse: storehouse,
								category: category,
								taxInclusivePriceCny: taxInclusivePriceCny,
								priceCny: priceCny,
								unitPriceCny: unitPriceCny,
							});
						} catch (error) {
							console.error(
								`Error at row ${i}, invalid data format, row ignored`
							);
							console.error(error);
						}
					}
					resolve(json);
				} else {
					reject("Sheet not found");
				}
			} catch (error) {
				throw error;
			}
		};

		reader.readAsArrayBuffer(file);
	});
}
