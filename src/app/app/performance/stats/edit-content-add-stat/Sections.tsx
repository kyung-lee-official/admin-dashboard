import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/button/Button";
import { CreateSectionData } from "@/utils/types/app/performance";
import { nanoid } from "nanoid";

type SectionProps = {
	sections: CreateSectionData[];
	setSections: Dispatch<SetStateAction<CreateSectionData[]>>;
};

export const Sections = (props: SectionProps) => {
	const { sections, setSections } = props;
	const [totalWeight, setTotalWeight] = useState(
		sections.reduce((acc, s) => acc + s.weight, 0)
	);

	useEffect(() => {
		let totalWeight = sections.reduce((acc, s) => acc + s.weight, 0);
		totalWeight = isNaN(totalWeight) ? 0 : totalWeight;
		setTotalWeight(totalWeight);
	}, [sections]);

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
							setSections(
								sections.concat({
									tempId: nanoid(),
									weight: 0,
									title: "New Section",
								})
							);
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
				{sections.length > 0 &&
					sections.map((s, i) => {
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
										border-[1px] border-neutral-700 border-t-neutral-600
										rounded"
										placeholder="Title"
										value={s.title}
										onChange={(e) => {
											setSections(
												sections.map((section) => {
													if (
														s.tempId ===
														section.tempId
													) {
														const title =
															e.target.value;
														return {
															tempId: s.tempId,
															weight: s.weight,
															title: title,
															description:
																s.description,
														};
													}
													return section;
												})
											);
										}}
									/>
									<div className="flex items-center gap-2">
										<div>Weight</div>
										<input
											type="number"
											className="w-16 px-2 py-0.5
											bg-transparent
											border-[1px] border-neutral-700 border-t-neutral-600
											rounded"
											min={0}
											max={100}
											value={s.weight}
											onChange={(e) => {
												setSections(
													sections.map((section) => {
														if (
															s.tempId ===
															section.tempId
														) {
															const weight =
																parseInt(
																	e.target
																		.value
																);
															return {
																tempId: s.tempId,
																weight: weight,
																title: s.title,
																description:
																	s.description,
															};
														}
														return section;
													})
												);
											}}
										/>
									</div>
									<Button
										size="sm"
										onClick={(e) => {
											e.preventDefault();
											setSections(
												sections.filter(
													(section) =>
														s.tempId !==
														section.tempId
												)
											);
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
										setSections(
											sections.map((section) => {
												if (
													s.tempId === section.tempId
												) {
													const description =
														e.target.value;
													return {
														tempId: s.tempId,
														weight: s.weight,
														title: s.title,
														description:
															description,
													};
												}
												return section;
											})
										);
									}}
								/>
							</div>
						);
					})}
			</div>
		</div>
	);
};
