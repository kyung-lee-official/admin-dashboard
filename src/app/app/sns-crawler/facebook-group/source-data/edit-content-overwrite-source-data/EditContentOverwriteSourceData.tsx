import { useAuthStore } from "@/stores/auth";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";
import Link from "next/link";
import { xlsxToJson } from "./xlsxToJson";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/utils/react-query/react-query";
import { overwriteFacebookGroupSourceData, SnsCrawlerQK } from "@/utils/api/app/sns-crawler";
import { FacebookGroupOverwriteSourceDto } from "@/utils/types/app/sns-crawler";

export const EditContentOverwriteSourceData = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.ADD_TEMPLATE;
	const title = "Overwrite Source Data";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const fileInputRef = useRef<HTMLInputElement>(null);

	/* md5 of the file */
	const [oldData, setOldData] = useState<FacebookGroupOverwriteSourceDto>([]);
	const [newData, setNewData] = useState(oldData);

	const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const json = await xlsxToJson(file);
		setNewData(json);

		if (fileInputRef.current) {
			/* This is to clear the input file value, so that the same file can be uploaded again */
			fileInputRef.current.value = "";
		}
	};

	const mutation = useMutation({
		mutationFn: async () => {
			return await overwriteFacebookGroupSourceData(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [SnsCrawlerQK.OVERWRITE_FACEBOOK_GROUP_SOURCE_DATA],
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
						href="/template-files/applications/sns-crawler/facebook-group/facebook-group-source-data-template.xlsx"
						className="flex justify-center py-1.5 px-3 text-sm leading-4
						text-neutral-600 dark:text-neutral-50
						bg-neutral-300 hover:bg-neutral-300/70 dark:bg-neutral-600 dark:hover:bg-neutral-600/70
						border-[1px] border-white/10 border-t-white/15 rounded-sm"
					>
						Download template
					</Link>
					<div className="text-sm text-white/50">
						The first column is group address, the suffix of the
						address should be group id, like
						https://www.facebook.com/groups/AnycubicPhoton ✅, other
						suffix is not allowed{" "}
						<del>
							https://www.facebook.com/groups/AnycubicPhoton/about
						</del>
						❌. The second column is group name.
					</div>
				</div>
				<div
					className="flex flex-col gap-1.5
					text-sm"
				>
					Select the xlsx file to overwrite the source data
					<input
						ref={fileInputRef}
						onChange={onFileChange}
						type="file"
						accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						className="flex justify-center py-1.5 px-3 text-sm leading-4
						text-neutral-600 dark:text-neutral-50
						bg-neutral-300 hover:bg-neutral-300/70 dark:bg-neutral-600 dark:hover:bg-neutral-600/70
						border-[1px] border-white/10 border-t-white/15 rounded-sm cursor-pointer"
					/>
				</div>
			</form>
		</EditContentRegular>
	);
};
