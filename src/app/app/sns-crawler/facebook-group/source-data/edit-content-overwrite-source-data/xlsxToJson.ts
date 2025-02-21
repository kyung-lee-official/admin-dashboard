import { FacebookGroupOverwriteSourceDto } from "@/utils/types/app/sns-crawler";
import * as ExcelJS from "exceljs";
import { z } from "zod";

type CellObj = {
	text: string;
	hyperlink: string;
};

function isCellObj(value: string | CellObj): value is CellObj {
	console.log(value);

	if (typeof value === "object") {
		return "text" in value && "hyperlink" in value;
	} else {
		return false;
	}
}

export async function xlsxToJson(
	file: File
): Promise<FacebookGroupOverwriteSourceDto> {
	return new Promise(async (resolve, reject) => {
		const reader = new FileReader();
		const json: FacebookGroupOverwriteSourceDto = [];
		const schema = z.object({
			groupAddress: z
				.string()
				.url()
				.regex(/facebook.com\/groups\/[a-zA-Z0-9\.]+\/*$/g),
			groupName: z.string(),
		});

		reader.onload = async (e) => {
			try {
				const buffer = reader.result as ArrayBuffer;
				const workbook = new ExcelJS.Workbook();
				await workbook.xlsx.load(buffer);
				const sheet = workbook.getWorksheet(1);
				if (sheet) {
					const lastRow = sheet.actualRowCount;
					for (let i = 1; i <= lastRow; i++) {
						const row = sheet.getRow(i);
						/* ignore empty row */
						if (!row.getCell(1).text || !row.getCell(2).text) {
							console.error(
								`Error at row ${i}, invalid data format, row ignored`
							);
							continue;
						}

						try {
							schema.parse({
								groupAddress: row.getCell(1).text as string,
								groupName: row.getCell(2).text as string,
							});
							json.push({
								groupAddress: row.getCell(1).text as string,
								groupName: row.getCell(2).text as string,
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
