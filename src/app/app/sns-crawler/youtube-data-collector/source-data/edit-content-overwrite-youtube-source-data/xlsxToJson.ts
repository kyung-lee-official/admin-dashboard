import { YoutubeDataOverwriteSourceDto } from "@/utils/types/app/sns-crawler";
import * as ExcelJS from "exceljs";
import { z } from "zod";

export async function xlsxToJson(
	file: File
): Promise<YoutubeDataOverwriteSourceDto> {
	return new Promise(async (resolve, reject) => {
		const reader = new FileReader();
		const json: YoutubeDataOverwriteSourceDto = [];
		const schema = z.object({
			keyword: z.string(),
		});

		reader.onload = async (e) => {
			try {
				const buffer = reader.result as ArrayBuffer;
				const workbook = new ExcelJS.Workbook();
				await workbook.xlsx.load(buffer);
				const sheet = workbook.worksheets[0];
				if (sheet) {
					for (let i = 1; i <= sheet.rowCount; i++) {
						const row = sheet.getRow(i);
						/* ignore empty row */
						if (!row.getCell(1).text) {
							console.warn(
								`Error at row ${i}, invalid data format, row ignored`
							);
							continue;
						}
						try {
							schema.parse({
								keyword: row.getCell(1).text as string,
							});
							json.push({
								keyword: row.getCell(1).text as string,
							});
						} catch (error) {
							console.warn(
								`Error parsing row ${i}, invalid data format, row ignored`
							);
							console.warn(error);
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
