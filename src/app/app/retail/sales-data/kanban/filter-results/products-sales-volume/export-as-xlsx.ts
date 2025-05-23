import ExcelJS from "exceljs";

export async function exportAsXlsx(
	tableData:
		| {
				columns: string[];
				rows: any[];
		  }
		| undefined
) {
	if (!tableData) return;

	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("Sheet1");
	
	/* set column widths */
	worksheet.columns = [
		{ width: 30 }, // first column
		{ width: 20 }, // second column
		...tableData.columns.slice(2).map(() => ({ width: 15 })), // default width for others
	];

	/* add header row */
	worksheet.addRow(tableData.columns);

	/* add data rows */
	tableData.rows.forEach((row) => {
		worksheet.addRow(row);
	});

	/* generate buffer and trigger download */
	const buffer = await workbook.xlsx.writeBuffer();
	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = "products-sales-volume.xlsx";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
