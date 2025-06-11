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

	/* filter out extra columns by name */
	const isExtraColumn = (col: string) =>
		col === "Available Stock" ||
		col === "Onway Stock" ||
		col === "Inventory Age" ||
		/Available Stock$/i.test(col) ||
		/Onway Stock$/i.test(col) ||
		/Inventory Age$/i.test(col);

	const exportColumnIndexes = tableData.columns
		.map((col, idx) => (!isExtraColumn(col) ? idx : -1))
		.filter((idx) => idx !== -1);

	const exportColumns = exportColumnIndexes.map(
		(idx) => tableData.columns[idx]
	);
	const exportRows = tableData.rows.map((row) =>
		exportColumnIndexes.map((idx) => row[idx])
	);

	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("Sheet1");

	/* set column widths */
	worksheet.columns = [
		{ width: 30 }, // first column
		{ width: 20 }, // second column
		...exportColumns.slice(2).map(() => ({ width: 15 })), // default width for others
	];

	/* add header row */
	worksheet.addRow(exportColumns);

	/* add data rows */
	exportRows.forEach((row) => {
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
