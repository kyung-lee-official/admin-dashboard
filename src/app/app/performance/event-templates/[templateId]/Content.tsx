"use client";

import { OneRowSkeleton } from "@/components/skeleton/OneRowSkeleton";
import { useAuthStore } from "@/stores/auth";
import { getTemplateById, PerformanceQK } from "@/utils/api/app/performance";
import { PerformanceEventTemplateResponse } from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const Content = (props: { templateId: string }) => {
	const { templateId } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const templateQuery = useQuery<
		PerformanceEventTemplateResponse,
		AxiosError
	>({
		queryKey: [PerformanceQK.GET_TEMPLATE_BY_ID, jwt],
		queryFn: async () => {
			const template = await getTemplateById(templateId, jwt);
			return template;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

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
						{/* <TitleMoreMenuItems /> */}
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
