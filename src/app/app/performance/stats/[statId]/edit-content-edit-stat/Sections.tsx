import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/button/Button";
import { DeleteConfirmDialog } from "@/components/delete-confirmation/DeleteConfirmDialog";
import { EditSectionData } from "@/utils/types/app/performance";
import { EditSectionAction, EditSectionType } from "./Reducers";

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
					statSections.map((s, i) => {
						return (
							<div
								key={i}
								className="flex flex-col
								border-[1px] border-white/20 border-t-white/30
								rounded"
							>
								<div
									className="flex justify-between items-center px-2 py-1
									bg-white/5"
								>
									<input
										type="text"
										className="w-40 px-2 py-0.5
										bg-transparent
										border-[1px] border-white/20 border-t-white/30
										rounded"
										value={s.title}
										onChange={(e) => {
											const title = e.target.value;
											dispatchStatSections({
												type: EditSectionType.UPDATE_TITLE,
												payload: {
													tempId: s.tempId,
													title,
												},
											});
										}}
									/>
									<div className="flex items-center gap-2">
										<div>Weight</div>
										<input
											type="number"
											className="w-16 px-2 py-0.5
											bg-transparent
											border-[1px] border-white/20 border-t-white/30
											rounded"
											value={s.weight}
											onChange={(e) => {
												const weight = parseInt(
													e.target.value
												);
												dispatchStatSections({
													type: EditSectionType.UPDATE_WEIGHT,
													payload: {
														tempId: s.tempId,
														weight,
													},
												});
											}}
										/>
									</div>
									<Button
										size="sm"
										onClick={(e) => {
											e.preventDefault();
											/* check whether the section is new or not */
											if (s.id) {
												/* if the section is not new, ask for confirmation */
												setDeleteTempId(s.tempId);
												setShowDeleteConfirm(true);
											} else {
												/* if the section is new, remove it immediately */
												dispatchStatSections({
													type: EditSectionType.DELETE,
													payload: {
														tempId: s.tempId,
													},
												});
											}
										}}
									>
										Delete
									</Button>
								</div>
								<textarea
									placeholder={"Description"}
									className="p-2
									bg-transparent
									border-t-[1px] border-white/20
									outline-none"
									value={s.description || ""}
									onChange={(e) => {
										const description = e.target.value;
										dispatchStatSections({
											type: EditSectionType.UPDATE_DESCRIPTION,
											payload: {
												tempId: s.tempId,
												description,
											},
										});
									}}
								/>
							</div>
						);
					})}
			</div>
			<DeleteConfirmDialog
				show={showDeleteConfirm}
				setShow={setShowDeleteConfirm}
				question={"Are you sure you want to delete this section?"}
				description={
					"This is an existing section. Deleting it will remove all events associated with it."
				}
				onDelete={() => {
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
