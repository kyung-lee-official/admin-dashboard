import { Button } from "@/components/button/Button";
import { useAuthStore } from "@/stores/auth";
import {
	deleteEventById,
	getMyPermissionOfEvent,
	PerformanceQK,
	updateEventById,
} from "@/utils/api/app/performance";
import {
	ApprovalType,
	EventResponse,
	SectionResponse,
} from "@/utils/types/app/performance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Edit } from "./Edit";
import { queryClient } from "@/utils/react-query/react-query";
import { Data } from "./Data";
import { useRouter } from "next/navigation";
import { PageBlock } from "@/components/content/PageContainer";
import { ConfirmDialogWithButton } from "@/components/confirm-dialog/ConfirmDialogWithButton";

export const Details = (props: {
	statId: number;
	sectionId: number;
	event: EventResponse;
	isEditing: boolean;
	setIsEditing: Dispatch<SetStateAction<boolean>>;
}) => {
	const { statId, sectionId, event, isEditing, setIsEditing } = props;

	const jwt = useAuthStore((state) => state.jwt);
	const router = useRouter();

	const [oldData, setOldData] = useState<EventResponse>({
		id: 0,
		approval: ApprovalType.PENDING,
		templateId: undefined,
		templateScore: 0,
		templateDescription: "",
		section: {} as unknown as SectionResponse,
		sectionId: 0,
		score: 0,
		amount: 0,
		description: "",
		attachments: [],
	});
	const [newData, setNewData] = useState(oldData);
	const [score, setScore] = useState(oldData.score);
	const [amount, setAmount] = useState(oldData.amount);
	const [description, setDescription] = useState(oldData.description);

	const myEventPermissionsQuery = useQuery({
		queryKey: [PerformanceQK.GET_MY_PERMISSION_OF_EVENT, event.id],
		queryFn: async () => {
			const eventPerms = await getMyPermissionOfEvent(event.id, jwt);
			return eventPerms;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const updateMutation = useMutation({
		mutationFn: () => {
			const dto = {
				description: newData.description,
				score: newData.score,
				amount: newData.amount,
			};
			return updateEventById(event.id, dto, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_STAT_BY_ID],
			});
			setIsEditing(false);
		},
		onError: () => {},
	});
	function onSave() {
		updateMutation.mutate();
	}

	const deleteMutation = useMutation({
		mutationFn: () => {
			return deleteEventById(event.id, jwt);
		},
		onSuccess: () => {
			router.push(
				`/app/performance/stats/${statId}/section/${sectionId}`
			);
		},
		onError: () => {},
	});
	function onDelete() {
		deleteMutation.mutate();
	}

	useEffect(() => {
		const initialData = {
			id: event.id,
			approval: event.approval,
			templateId: event.templateId,
			templateScore: event.templateScore,
			templateDescription: event.templateDescription,
			section: event.section,
			sectionId: event.sectionId,
			score: event.score,
			amount: event.amount,
			description: event.description,
			attachments: event.attachments,
		};
		setOldData(initialData);
		setNewData(initialData);
		setScore(initialData.score);
		setAmount(initialData.amount);
		setDescription(initialData.description);
	}, [event]);

	useEffect(() => {
		setNewData({
			id: oldData.id,
			approval: oldData.approval,
			templateId: oldData.templateId,
			templateScore: oldData.templateScore,
			templateDescription: oldData.templateDescription,
			section: oldData.section,
			sectionId: oldData.sectionId,
			score: score,
			amount: amount,
			description: description,
			attachments: oldData.attachments,
		});
	}, [score, amount, description]);

	function discard() {
		setScore(oldData.score);
		setAmount(oldData.amount);
		setDescription(oldData.description);
		setIsEditing(false);
	}

	return (
		<PageBlock
			title="Details"
			moreMenu={
				event.approval !== "APPROVED" && isEditing ? (
					<div className="flex gap-x-2">
						<Button size="sm" onClick={onSave}>
							Save
						</Button>
						{JSON.stringify(oldData) !== JSON.stringify(newData) ? (
							<ConfirmDialogWithButton
								question={"Are you sure you want to leave?"}
								confirmText="Continue"
								onOk={discard}
							>
								<Button size="sm">Cancel</Button>
							</ConfirmDialogWithButton>
						) : (
							<Button size="sm" onClick={discard}>
								Cancel
							</Button>
						)}
					</div>
				) : (
					<div className="flex gap-x-2">
						{event.approval !== "APPROVED" &&
							myEventPermissionsQuery.data &&
							myEventPermissionsQuery.data.actions["update"] ===
								"EFFECT_ALLOW" && (
								<Button
									size="sm"
									onClick={() => {
										setIsEditing(true);
									}}
								>
									Edit
								</Button>
							)}
						{myEventPermissionsQuery.data &&
							myEventPermissionsQuery.data.actions["delete"] ===
								"EFFECT_ALLOW" && (
								<ConfirmDialogWithButton
									question={
										"Are you sure you want to delete this event?"
									}
									onOk={onDelete}
								>
									<Button size="sm">Delete Event</Button>
								</ConfirmDialogWithButton>
							)}
					</div>
				)
			}
		>
			{isEditing ? (
				<Edit
					setIsEditing={setIsEditing}
					id={event.id}
					templateId={event.templateId}
					templateScore={event.templateScore}
					templateDescription={event.templateDescription}
					score={score}
					setScore={setScore}
					amount={amount}
					setAmount={setAmount}
					description={description}
					setDescription={setDescription}
					attachments={event.attachments}
				/>
			) : (
				<Data
					setIsEditing={setIsEditing}
					id={event.id}
					templateId={event.templateId}
					templateScore={event.templateScore}
					templateDescription={event.templateDescription}
					score={score}
					setScore={setScore}
					amount={amount}
					setAmount={setAmount}
					description={description}
					setDescription={setDescription}
					attachments={event.attachments}
				/>
			)}
		</PageBlock>
	);
};
