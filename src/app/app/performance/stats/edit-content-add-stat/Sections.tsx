import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/button/Button";
import { CreateSectionData } from "@/utils/types/app/performance";
import { nanoid } from "nanoid";
import { Section } from "./Section";

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
									memberRoleId: null,
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
							<Section
								key={i}
								s={s}
								sections={sections}
								setSections={setSections}
							/>
						);
					})}
			</div>
		</div>
	);
};
