"use client";

import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
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
		<PageContainer>
			<PageBlock
				title="Template"
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								{
									content: "Delete Template",
									type: "danger",
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
					</>
				}
			>
				<Table>
					<Tbody>
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
					</Tbody>
				</Table>
			</PageBlock>
		</PageContainer>
	);
};
