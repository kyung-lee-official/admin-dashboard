import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/button/Button";
import { Section } from "@/utils/types/app/performance";

type SectionProps = {
	sections: Section[];
	setSections: Dispatch<SetStateAction<Section[]>>;
};

export const Sections = (props: SectionProps) => {
	const { sections, setSections } = props;

	return (
		<div
			className="flex flex-col w-full
			text-white/90
			bg-neutral-900
			rounded border-[1px] border-neutral-700 border-t-neutral-600"
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
								weight: 0,
								title: "New Section",
							})
						);
					}}
				>
					Create
				</Button>
			</div>
			{sections.length > 0 && (
				<div className="flex flex-col">
					{sections.map((s, i) => {
						return (
							<div
								key={i}
								className="flex flex-col px-2 py-4 gap-2
								bg-white/5
								border-t-[1px] border-neutral-700
								rounded"
							>
								<div className="flex justify-between items-center">
									<input
										type="text"
										className="w-40 px-2 py-0.5
										bg-transparent
										border-[1px] border-neutral-700 border-t-neutral-600
										rounded"
										value={s.title}
										onChange={(e) => {
											setSections(
												sections.map((section, j) => {
													if (i === j) {
														return {
															weight: s.weight,
															title: e.target
																.value,
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
											value={s.weight}
											onChange={(e) => {
												setSections(
													sections.map(
														(section, j) => {
															if (i === j) {
																return {
																	weight: parseInt(
																		e.target
																			.value
																	),
																	title: s.title,
																	description:
																		s.description,
																};
															}
															return section;
														}
													)
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
													(_, j) => j !== i
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
									border-[1px] border-neutral-700 border-t-neutral-600
									rounded"
									onChange={(e) => {
										setSections(
											sections.map((section, j) => {
												if (i === j) {
													return {
														weight: s.weight,
														title: s.title,
														description:
															e.target.value,
													};
												}
												return section;
											})
										);
									}}
								></textarea>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
