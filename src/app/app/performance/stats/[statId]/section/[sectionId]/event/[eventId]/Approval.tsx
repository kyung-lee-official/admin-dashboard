import { Dropdown } from "@/components/input/dropdown/Dropdown";
import { useAuthStore } from "@/stores/auth";
import {
	PerformanceQK,
	updateApprovalByEventId,
} from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import {
	ApprovalType,
	EventResponse,
	UpdateApprovalDto,
} from "@/utils/types/app/performance";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const Approval = (props: { event: EventResponse }) => {
	const { event } = props;

	const [oldData, setOldData] = useState<ApprovalType>(event.approval);
	const [newData, setNewData] = useState<ApprovalType | undefined>(oldData);

	const jwt = useAuthStore((state) => state.jwt);

	const mutation = useMutation({
		mutationFn: async () => {
			const dto = {
				approval: newData,
			};
			return await updateApprovalByEventId(
				event.id,
				dto as UpdateApprovalDto,
				jwt
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_STAT_BY_ID],
			});
		},
		onError: () => {},
	});

	useEffect(() => {
		mutation.mutate();
	}, [newData]);

	return (
		<div
			className="text-white/50
			bg-white/5
			border-[1px] border-white/10 border-t-white/15
			rounded-md"
		>
			<div className="relative flex justify-between items-center px-6 py-4">
				<div>Approval</div>
				<Dropdown<ApprovalType>
					kind="string"
					mode="regular"
					selected={newData}
					setSelected={setNewData}
					options={[
						ApprovalType.PENDING,
						ApprovalType.APPROVED,
						ApprovalType.REJECTED,
					]}
					placeholder=""
				/>
			</div>
		</div>
	);
};
