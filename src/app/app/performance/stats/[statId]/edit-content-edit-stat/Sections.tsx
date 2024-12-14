import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/button/Button";
import { EditPerformanceStatData } from "@/utils/types/app/performance";
import { DeleteConfirmDialog } from "@/components/delete-confirmation/DeleteConfirmDialog";
import { nanoid } from "nanoid";

export const Sections = (props: {
	newData: EditPerformanceStatData;
	setNewData: Dispatch<SetStateAction<EditPerformanceStatData>>;
}) => {
	const { newData, setNewData } = props;
	const [showDeleteConfirm, setshowDeleteConfirm] = useState(false);
	const [totalWeight, setTotalWeight] = useState(
		newData.statSections.reduce((acc, s) => acc + s.weight, 0)
	);

	useEffect(() => {
		setTotalWeight(
			newData.statSections.reduce((acc, s) => acc + s.weight, 0)
		);
	}, [newData.statSections]);

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
							setNewData({
								ownerId: newData.ownerId,
								month: newData.month,
								statSections: newData.statSections.concat({
									tempId: nanoid(),
									weight: 0,
									title: "New Section",
								}),
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
			<div
				className="flex flex-col h-[calc(100svh-18px-61px-32px-20px-24px-72px-12px-62px)] gap-2
				overflow-y-auto"
			>
				{newData.statSections.length > 0 &&
					newData.statSections.map((s, i) => {
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
											const newValue = e.target.value;
											setNewData({
												ownerId: newData.ownerId,
												month: newData.month,
												statSections:
													newData.statSections.map(
														(section) => {
															if (
																s.tempId ===
																section.tempId
															) {
																return {
																	id: s.id,
																	tempId: s.tempId,
																	weight: s.weight,
																	title: newValue,
																	description:
																		s.description,
																};
															}
															return section;
														}
													),
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
												const newValue = parseInt(
													e.target.value
												);
												setNewData({
													ownerId: newData.ownerId,
													month: newData.month,
													statSections:
														newData.statSections.map(
															(section) => {
																if (
																	s.tempId ===
																	section.tempId
																) {
																	return {
																		id: s.id,
																		tempId: s.tempId,
																		weight: newValue,
																		title: s.title,
																		description:
																			s.description,
																	};
																}
																return section;
															}
														),
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
												setshowDeleteConfirm(true);
											} else {
												/* if the section is new, remove it immediately */
												setNewData({
													ownerId: newData.ownerId,
													month: newData.month,
													statSections:
														newData.statSections.filter(
															(section) =>
																section.tempId !==
																s.tempId
														),
												});
											}
										}}
									>
										Delete
									</Button>
									<DeleteConfirmDialog
										show={showDeleteConfirm}
										setShow={setshowDeleteConfirm}
										question={
											"Are you sure you want to delete this section?"
										}
										description={
											"This is an existing section. Deleting it will remove all events associated with it."
										}
										onDelete={() => {
											setNewData({
												ownerId: newData.ownerId,
												month: newData.month,
												statSections:
													newData.statSections.filter(
														(_, j) => j !== i
													),
											});
											setshowDeleteConfirm(false);
										}}
									/>
								</div>
								<textarea
									placeholder={"Description"}
									className="p-2
									bg-transparent
									border-t-[1px] border-white/20
									outline-none"
									value={s.description}
									onChange={(e) => {
										const newValue = e.target.value;
										setNewData({
											ownerId: newData.ownerId,
											month: newData.month,
											statSections:
												newData.statSections.map(
													(section) => {
														if (
															s.tempId ===
															section.tempId
														) {
															return {
																id: s.id,
																tempId: s.tempId,
																weight: s.weight,
																title: s.title,
																description:
																	newValue,
															};
														}
														return section;
													}
												),
										});
									}}
								></textarea>
							</div>
						);
					})}
			</div>
		</div>
	);
};
