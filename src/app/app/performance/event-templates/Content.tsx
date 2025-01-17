"use client";

import { useState } from "react";
import { MemberRole } from "@/utils/types/internal";
import { RoleSelector } from "../../../../components/input/selectors/RoleSelector";
import { TemplateList } from "./TemplateList";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { deleteStatById, PerformanceQK } from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { EditIcon } from "@/components/icons/Icons";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { createPortal } from "react-dom";

export const Content = () => {
	const [role, setRole] = useState<MemberRole>();

	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_TEMPLATE,
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
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Events Template</div>
					<TitleMoreMenu
						items={[
							{
								text: "Add Template",
								hideMenuOnClick: true,
								icon: <EditIcon size={15} />,
								onClick: () => {
									setEdit({
										show: true,
										id: EditId.ADD_TEMPLATE,
									});
								},
							},
						]}
					/>
					<ConfirmDialog
						show={showDeleteConfirmation}
						setShow={setShowDeleteConfirmation}
						question={"Are you sure you want to delete this stat?"}
						onOk={onDelete}
					/>
					{createPortal(
						<EditPanel edit={edit} setEdit={setEdit} />,
						document.body
					)}
				</div>
				<div
					className="flex items-center px-6 py-4 gap-6
					text-sm
					rounded-md border-t-[1px] border-white/10"
				>
					<RoleSelector role={role} setRole={setRole} />
				</div>
				<TemplateList role={role} />
			</div>
		</div>
	);
};
