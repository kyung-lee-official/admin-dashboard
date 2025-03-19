"use client";

import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { DeleteIcon } from "@/components/icons/Icons";
import { OneRowSkeleton } from "@/components/skeleton/OneRowSkeleton";
import { useAuthStore } from "@/stores/auth";
import {
	deleteTemplateById,
	getTemplateById,
	PerformanceQK,
} from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { PerformanceEventTemplateResponse } from "@/utils/types/app/performance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Content = (props: { templateId: string }) => {
	const { templateId } = props;

	const jwt = useAuthStore((state) => state.jwt);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const templateQuery = useQuery<
		PerformanceEventTemplateResponse,
		AxiosError
	>({
		queryKey: [PerformanceQK.GET_TEMPLATE_BY_ID],
		queryFn: async () => {
			const template = await getTemplateById(templateId, jwt);
			return template;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const router = useRouter();
	const mutation = useMutation({
		mutationFn: () => {
			return deleteTemplateById(templateId, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_STATS],
			});
			router.push("/app/performance/event-templates");
		},
		onError: () => {},
	});

	function onDelete() {
		mutation.mutate();
	}

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="flex flex-col gap-3
				text-white/90"
			>
				<div
					className="relative flex flex-col
					bg-white/5
					border-[1px] border-white/10 border-t-white/15
					rounded-md"
				>
					<div className="flex justify-between items-center w-full px-6 py-4">
						<div className="text-lg font-semibold">Template</div>
						<TitleMoreMenu
							items={[
								{
									content: "Delete Stat",
									hideMenuOnClick: true,
									icon: <DeleteIcon size={15} />,
									onClick: () => {
										setShowDeleteConfirmation(true);
									},
								},
							]}
						/>
						<ConfirmDialog
							show={showDeleteConfirmation}
							setShow={setShowDeleteConfirmation}
							question={
								"Are you sure you want to delete this stat?"
							}
							onOk={onDelete}
						/>
					</div>
					<table
						className="w-full
						text-sm text-white/50"
					>
						<tbody
							className="[&_>_tr_>_td]:px-6 [&_>_tr_>_td]:py-3
							[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
						>
							<tr>
								<td>Template ID</td>
								<td>{templateId}</td>
							</tr>
							<tr>
								<td>Role</td>
								<td>
									{templateQuery.data ? (
										templateQuery.data.memberRole.name
									) : (
										<OneRowSkeleton />
									)}
								</td>
							</tr>
							<tr>
								<td>Score</td>
								<td>
									{templateQuery.data ? (
										templateQuery.data.score
									) : (
										<OneRowSkeleton />
									)}
								</td>
							</tr>
							<tr>
								<td>Description</td>
								<td>
									{templateQuery.data ? (
										templateQuery.data.description
									) : (
										<OneRowSkeleton />
									)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
