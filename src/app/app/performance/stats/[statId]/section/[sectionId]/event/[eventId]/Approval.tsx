import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { PageBlock } from "@/components/content/PageContainer";

export const Approval = (props: {
	event: EventResponse;
	setIsEditing: Dispatch<SetStateAction<boolean>>;
}) => {
	const { event, setIsEditing } = props;

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
			if (dto.approval === "APPROVED") {
				setIsEditing(false);
			}
			return await updateApprovalByEventId(
				event.id,
				dto as UpdateApprovalDto,
				jwt
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_EVENT_BY_ID, event.id],
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
					<PageBlock
						title="Approval"
						moreMenu={
							<div className="w-40">
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
						}
					></PageBlock>
				);
			case "EFFECT_DENY":
				return (
					<PageBlock
						title="Approval"
						moreMenu={
							<div
								className="flex items-center gap-x-2
								text-neutral-400 "
							>
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
						}
					></PageBlock>
				);
			default:
				return null;
		}
	} else {
		return null;
	}
};
