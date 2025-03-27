import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import {
	getApprovalPermissions,
	PerformanceQK,
	updateApprovalByEventId,
} from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import {
	ApprovalType,
	EventResponse,
	UpdateApprovalDto,
} from "@/utils/types/app/performance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dropdown } from "@/components/input/dropdown/Dropdown";
import { VerifiedIcon } from "@/components/icons/Icons";

export const Approval = (props: { event: EventResponse }) => {
	const { event } = props;

	const [oldData, setOldData] = useState<
		ApprovalType | ApprovalType[] | null
	>(event.approval);
	const [newData, setNewData] = useState<
		ApprovalType | ApprovalType[] | null
	>(oldData);

	const jwt = useAuthStore((state) => state.jwt);
	const getApprovalPermPermQuery = useQuery({
		queryKey: [PerformanceQK.GET_APPROVAL_PERMISSIONS],
		queryFn: async () => {
			const data = await getApprovalPermissions(event.id, jwt);
			return data;
		},
	});

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

	if (getApprovalPermPermQuery.isSuccess && getApprovalPermPermQuery.data) {
		switch (getApprovalPermPermQuery.data.actions["update"]) {
			case "EFFECT_ALLOW":
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
			case "EFFECT_DENY":
				return (
					<div
						className="text-white/50
						bg-white/5
						border-[1px] border-white/10 border-t-white/15
						rounded-md"
					>
						<div className="relative flex justify-between items-center px-6 py-4">
							<div>Approval</div>
							<div className="flex items-center gap-x-2">
								<div
									className="flex items-center min-h-8 px-2 py-1
									text-sm
									bg-neutral-800
									border-1 border-neutral-700 rounded-md"
								>
									{newData}
								</div>
								{newData === ApprovalType.APPROVED && (
									<VerifiedIcon size={20} />
								)}
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	} else {
		return null;
	}
};
