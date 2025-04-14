import { useAuthStore } from "@/stores/auth";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import Link from "next/link";
import { xlsxToJson } from "./xlsxToJson";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/utils/react-query/react-query";
import { Button } from "@/components/button/Button";
import { RetailSalesData } from "../types";
import {
	importRetailSalesData,
	RetailSalesDataQK,
} from "@/utils/api/app/retail/sales-data";

export const EditContentImportRetailSalesData = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.RETAIL_IMPORT_SALES_DATA;
	const title = "Import New Data";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const [oldData, setOldData] = useState<RetailSalesData[]>([]);
	const [newData, setNewData] = useState(oldData);
	const [file, setFile] = useState<File | null>(null);

	const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const json = await xlsxToJson(file);
		setNewData(json);
		setFile(file);

		if (fileInputRef.current) {
			/* this is to clear the input file value, so that the same file can be uploaded again */
			fileInputRef.current.value = "";
		}
	};

	const mutation = useMutation({
		mutationFn: async () => {
			return await importRetailSalesData(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [RetailSalesDataQK.GET_SALES_DATA_IMPORT_BATCHES],
			});
			setEdit({ show: false, id: editId });
		},
		onError: () => {},
	});

	function onSave() {
		mutation.mutate();
	}

	return (
		<EditContentRegular
			title={title}
			editId={editId}
			edit={edit}
			setEdit={setEdit}
			onSave={onSave}
			newData={newData}
			oldData={oldData}
		>
			<form action={onSave} className="flex flex-col px-6 py-4 gap-6">
				<div className="flex flex-col gap-1">
					<Link
						href="/template-files/applications/sns-crawler/youtube-data-collector/youtube-source-data-template.xlsx"
						className="flex justify-center py-1.5 px-3 text-sm leading-4
						text-neutral-600 dark:text-neutral-50
						bg-neutral-300 hover:bg-neutral-300/70 dark:bg-neutral-600 dark:hover:bg-neutral-600/70
						border-[1px] border-white/10 border-t-white/15 rounded-sm"
					>
						Download Template
					</Link>
					<div className="text-sm text-white/50">
						The source data sheet must be named "源数据" in the xlsx
						file so that it can be imported correctly.
					</div>
				</div>
				<div
					className="flex flex-col gap-1.5
					text-sm"
				>
					Select the xlsx file to import new sales data.
					<input
						ref={fileInputRef}
						onChange={onFileChange}
						type="file"
						accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						className="hidden"
					/>
					<Button
						size="sm"
						onClick={(e) => {
							e.preventDefault();
							fileInputRef.current?.click();
						}}
					>
						Select File
					</Button>
					<div>{file?.name}</div>
				</div>
			</form>
		</EditContentRegular>
	);
};
