import { Button } from "@/components/button/Button";
import {
	forwardRef,
	ForwardedRef,
	MutableRefObject,
	useRef,
	Dispatch,
	SetStateAction,
} from "react";
import { EditProps } from "./EditPanel";

export const UnsavedDialog = forwardRef(function UnsavedDialog(
	props: { setEdit: Dispatch<SetStateAction<EditProps>> },
	ref: ForwardedRef<HTMLDialogElement | null>
) {
	const { setEdit } = props;

	const dialogRef = ref as MutableRefObject<HTMLDialogElement | null>;
	const contentRef = useRef<HTMLDivElement | null>(null);
	return (
		<dialog
			ref={dialogRef}
			className="w-full max-w-[400px] mx-auto
			text-white/90
			bg-neutral-800
			border-[1px] border-white/10
			shadow-lg rounded-md backdrop:bg-black/50 outline-none"
		>
			<div ref={contentRef} className="flex flex-col pt-6 px-6 gap-1.5">
				<div className="font-semibold">
					Are you sure you want to leave this form?
				</div>
				<div className="text-sm text-white/50">
					You have unsaved changes that will be lost if you exit this
					form.
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
						if (dialogRef.current) {
							dialogRef.current.close();
						}
					}}
				>
					Cancel
				</Button>
				<Button
					size="sm"
					onClick={() => {
						if (dialogRef.current) {
							dialogRef.current.close();
							setEdit({ show: false, id: "sign-up" });
						}
					}}
				>
					Continue
				</Button>
			</div>
		</dialog>
	);
});
