import { useState } from "react";
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";
import { createPortal } from "react-dom";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/utils/react-query/react-query";
import { deleteStatById, PerformanceQK } from "@/utils/api/app/performance";
import { useAuthStore } from "@/stores/auth";
import { DeleteConfirmDialog } from "@/components/delete-confirmation/DeleteConfirmDialog";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";

export const TitleMoreMenuItems = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.EDIT_STAT,
	});

	const params = useParams();
	const statId = parseInt(params.statId as string);
	const jwt = useAuthStore((state) => state.jwt);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const router = useRouter();
	const mutation = useMutation({
		mutationFn: () => {
			return deleteStatById(statId, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_STATS],
			});
			router.push("/app/performance/stats");
		},
		onError: () => {},
	});

	function onDelete() {
		mutation.mutate();
	}

	return (
		<>
			<TitleMoreMenu
				items={[
					{
						text: "Edit Stat",
						hideMenuOnClick: true,
						icon: <EditIcon size={15} />,
						onClick: () => {
							setEdit({
								show: true,
								id: EditId.EDIT_STAT,
								auxData: {
									statId: statId,
								},
							});
						},
					},
					{
						text: "Delete Stat",
						hideMenuOnClick: true,
						icon: <DeleteIcon size={15} />,
						onClick: () => {
							setShowDeleteConfirmation(true);
						},
					},
				]}
			/>
			<DeleteConfirmDialog
				show={showDeleteConfirmation}
				setShow={setShowDeleteConfirmation}
				question={"Are you sure you want to delete this stat?"}
				onDelete={onDelete}
			/>
			{createPortal(
				<EditPanel edit={edit} setEdit={setEdit} />,
				document.body
			)}
		</>
	);
};
