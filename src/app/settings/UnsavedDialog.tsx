import { Dispatch, SetStateAction, useRef } from "react";
import { EditProps } from "../../components/edit-panel/EditPanel";
import { Button } from "@/components/button/Button";

export const UnsavedDialog = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
	showUnsaved: boolean;
	setShowUnsaved: Dispatch<SetStateAction<boolean>>;
}) => {
	const { edit, setEdit, showUnsaved, setShowUnsaved } = props;

	if (showUnsaved) {
		return (
			<div
				className="fixed top-0 right-0 bottom-0 left-0
				bg-black/50 flex justify-center items-center
				z-30"
			>
				<div
					className="w-full max-w-[400px] mx-auto
					text-white/90
					bg-neutral-800
					border-[1px] border-white/10
					shadow-lg rounded-md backdrop:bg-black/50 outline-none"
				>
					<div className="flex flex-col pt-6 px-6 gap-1.5">
						<div className="font-semibold">
							Are you sure you want to leave this form?
						</div>
						<div className="text-sm text-white/50">
							You have unsaved changes that will be lost if you
							exit this form.
						</div>
					</div>
					<div
						className="flex justify-end p-6 gap-1.5
						leading-4"
					>
						<Button
							color="cancel"
							size="sm"
							onClick={() => {
								setShowUnsaved(false);
							}}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							onClick={() => {
								setShowUnsaved(false);
								setEdit({ show: false, id: edit.id });
							}}
						>
							Continue
						</Button>
					</div>
				</div>
			</div>
		);
	} else {
		return null;
	}
};
