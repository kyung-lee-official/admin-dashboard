"use client";

import { ConfirmDialogWithButton } from "@/components/confirm-dialog/ConfirmDialogWithButton";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { DeleteIcon } from "@/components/icons/Icons";
import { Exception } from "@/components/page-authorization/Exception";
import { Forbidden } from "@/components/page-authorization/Forbidden";
import { Loading } from "@/components/page-authorization/Loading";
import { OneRowSkeleton } from "@/components/skeleton/OneRowSkeleton";
import { useAuthStore } from "@/stores/auth";
import {
	deleteTemplateById,
	getTemplateById,
	getTemplatePermissions,
	PerformanceQK,
} from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { PerformanceEventTemplateResponse } from "@/utils/types/app/performance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export const Content = (props: { templateId: string }) => {
	const { templateId } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const templatePermQuery = useQuery({
		queryKey: [PerformanceQK.GET_MY_TEMPLATE_PERMISSIONS],
		queryFn: async () => {
			const data = await getTemplatePermissions(
				parseInt(templateId),
				jwt
			);
			return data;
		},
	});

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
				queryKey: [PerformanceQK.GET_TEMPLATE_BY_ID],
			});
			router.push("/app/performance/event-templates");
		},
		onError: () => {},
	});

	function onDelete() {
		mutation.mutate();
	}

	if (templatePermQuery.isPending) {
		return <Loading />;
	}

	if (templatePermQuery.isSuccess && templatePermQuery.data) {
		switch (templatePermQuery.data.actions["read"]) {
			case "EFFECT_ALLOW":
				return (
					<PageContainer>
						<PageBlock
							title="Template"
							moreMenu={
								<>
									<TitleMoreMenu
										items={[
											<ConfirmDialogWithButton
												key={"delete-template"}
												question={
													"Are you sure you want to delete this template?"
												}
												onOk={onDelete}
											>
												<button
													className={`flex items-center w-full px-2 py-1.5 gap-2
													text-red-500
													hover:bg-white/5
													rounded cursor-pointer whitespace-nowrap`}
												>
													<DeleteIcon size={15} />
													Delete Template
												</button>
											</ConfirmDialogWithButton>,
										]}
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
												templateQuery.data.memberRole
													.name
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
			default:
				return <Forbidden />;
		}
	} else {
		return <Exception />;
	}
};
