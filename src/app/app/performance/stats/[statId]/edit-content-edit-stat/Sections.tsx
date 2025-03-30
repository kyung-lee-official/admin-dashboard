import { Button } from "@/components/button/Button";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { EditSectionData } from "@/utils/types/app/performance";
import { Dispatch, useEffect, useState } from "react";
import { EditSectionAction, EditSectionType } from "./Reducers";
import { Section } from "./Section";

export const Sections = (props: {
	statSections: EditSectionData[];
	dispatchStatSections: Dispatch<EditSectionAction>;
}) => {
	const { statSections, dispatchStatSections } = props;
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [totalWeight, setTotalWeight] = useState(
		statSections.reduce((acc, s) => acc + s.weight, 0)
	);

	const [deleteTempId, setDeleteTempId] = useState("");

	useEffect(() => {
		setTotalWeight(statSections.reduce((acc, s) => acc + s.weight, 0));
	}, [statSections]);

	return (
		<div
			className="flex flex-col w-full gap-3
			text-white/50"
		>
			<div
				className="flex flex-col
				border-[1px] border-white/20 border-t-white/30
				rounded"
			>
				<div
					className="flex justify-between items-center px-2 py-1
					bg-white/10"
				>
					<div>Sections</div>
					<Button
						size="sm"
						onClick={(e) => {
							e.preventDefault();
							dispatchStatSections({
								type: EditSectionType.CREATE,
							});
						}}
					>
						Create
					</Button>
				</div>
				<div className="flex justify-between items-center h-8 px-2 py-1">
					<div>Total Weight</div>
					<div className={totalWeight !== 100 ? "text-red-500" : ""}>
						{totalWeight}
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				{statSections.length > 0 &&
					[...statSections]
						/* sort by createdAt */
						.sort((a, b) => {
							return (
								new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime()
							);
						})
						.map((s) => {
							return (
								<Section
									key={s.tempId}
									s={s}
									dispatchStatSections={dispatchStatSections}
									setDeleteTempId={setDeleteTempId}
									setShowDeleteConfirm={setShowDeleteConfirm}
								/>
							);
						})}
			</div>
			<ConfirmDialog
				show={showDeleteConfirm}
				setShow={setShowDeleteConfirm}
				question={"Are you sure you want to delete this section?"}
				description={
					"This is an existing section. Deleting it will remove all events associated with it."
				}
				onOk={() => {
					dispatchStatSections({
						type: EditSectionType.DELETE,
						payload: { tempId: deleteTempId },
					});
					setShowDeleteConfirm(false);
				}}
			/>
		</div>
	);
};
