import { DropdownInput } from "@/components/input/DropdownInput";
import { ApprovalType } from "@/utils/types/app/performance";
import { useState } from "react";

type Approval = {
	order: string;
	approval: ApprovalType;
};

export const Approval = () => {
	const [oldData, setOldData] = useState<Approval>({
		order: "1",
		approval: ApprovalType.PENDING,
	});
	const [newData, setNewData] = useState<Approval>(oldData);

	return (
		<div
			className="text-white/50
			bg-white/5
			border-[1px] border-white/10 border-t-white/15
			rounded-md"
		>
			<div className="relative flex justify-between items-center px-6 py-4">
				<div>Approval</div>
				<DropdownInput
					mode="regular"
					selected={newData}
					setSelected={setNewData}
					options={[
						{ order: "1", approval: ApprovalType.PENDING },
						{ order: "2", approval: ApprovalType.APPROVED },
						{ order: "3", approval: ApprovalType.REJECTED },
					]}
					placeholder=""
					labelProp={{ primary: "approval" }}
					sortBy={"order"}
				/>
			</div>
		</div>
	);
};
