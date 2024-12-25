import { Button } from "@/components/button/Button";
import { useAuthStore } from "@/stores/auth";
import {
	deleteEventById,
	PerformanceQK,
	updateEventById,
} from "@/utils/api/app/performance";
import { EventResponse } from "@/utils/types/app/performance";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Edit } from "./Edit";
import { Attachments } from "./Attachments";
import { DeleteConfirmDialog } from "@/components/delete-confirmation/DeleteConfirmDialog";
import { queryClient } from "@/utils/react-query/react-query";
import { Data } from "./Data";
import { useRouter } from "next/navigation";

export const Details = (props: {
	statId: number;
	sectionId: number;
	event: EventResponse;
}) => {
	const { statId, sectionId, event } = props;

	const [isEditing, setIsEditing] = useState(false);

	const jwt = useAuthStore((state) => state.jwt);
	const router = useRouter();

	const [oldData, setOldData] = useState<EventResponse>({
		id: 0,
		templateId: undefined,
		templateScore: 0,
		templateDescription: "",
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

	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
			setShowDeleteConfirmation(true);
		},
		onError: () => {},
	});
	function onDelete() {
		deleteMutation.mutate();
	}

	useEffect(() => {
		const initialData = {
			id: event.id,
			templateId: event.templateId,
			templateScore: event.templateScore,
			templateDescription: event.templateDescription,
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
			id: newData.id,
			templateId: newData.templateId,
			templateScore: newData.templateScore,
			templateDescription: newData.templateDescription,
			sectionId: newData.sectionId,
			score: score,
			amount: amount,
			description: description,
			attachments: newData.attachments,
		});
	}, [score, amount, description]);

	return (
		<div className="flex flex-col gap-y-3">
			<div
				className="text-white/50
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div>Details</div>
					{isEditing ? (
						<div className="flex gap-x-2">
							<Button size="sm" onClick={onSave}>
								Save
							</Button>
							<Button
								size="sm"
								onClick={() => {
									setIsEditing(false);
								}}
							>
								Cancel
							</Button>
						</div>
					) : (
						<div className="flex gap-x-2">
							<Button
								size="sm"
								onClick={() => {
									setIsEditing(true);
								}}
							>
								Edit
							</Button>
							<Button
								size="sm"
								onClick={() => {
									setShowDeleteConfirmation(true);
								}}
							>
								Delete
							</Button>
						</div>
					)}
				</div>
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
			</div>
			<Attachments />
			<DeleteConfirmDialog
				show={showDeleteConfirmation}
				setShow={setShowDeleteConfirmation}
				question={"Are you sure you want to delete this event?"}
				onDelete={onDelete}
			/>
		</div>
	);
};
