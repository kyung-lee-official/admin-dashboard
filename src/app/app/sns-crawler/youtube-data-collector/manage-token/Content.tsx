"use client";

import { Button } from "@/components/button/Button";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody, Thead } from "@/components/content/Table";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import {
	deleteToken,
	getYouTubeTokens,
	markTokenAsAvailable,
	SnsYouTubeDataQK,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";
import { queryClient } from "@/utils/react-query/react-query";
import { YouTubeToken } from "@/utils/types/app/sns-crawler";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { createPortal } from "react-dom";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_YOUTUBE_TOKEN,
	});
	const [tokenToDelete, setTokenToDelete] = useState("");
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const jwt = useAuthStore((state) => state.jwt);
	const getYouTubeTokensQuery = useQuery<YouTubeToken[]>({
		queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TOKENS],
		queryFn: async () => {
			const youtubeToken = await getYouTubeTokens(jwt);
			return youtubeToken;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const mutation = useMutation({
		mutationFn: () => {
			return deleteToken(tokenToDelete, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TOKENS],
			});
		},
		onError: () => {},
	});

	const markAsAvailableMutation = useMutation({
		mutationFn: (data: string) => {
			return markTokenAsAvailable(data, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [SnsYouTubeDataQK.GET_YOUTUBE_TOKENS],
			});
		},
		onError: () => {},
	});

	return (
		<PageContainer>
			<PageBlock
				title="Manage Token"
				moreMenu={
					<>
						<TitleMoreMenu
							items={[
								{
									content: "Add Token",
									hideMenuOnClick: true,
									icon: <EditIcon size={15} />,
									onClick: () => {
										setEdit({
											show: true,
											id: EditId.ADD_YOUTUBE_TOKEN,
										});
									},
								},
							]}
						/>
						{createPortal(
							<EditPanel edit={edit} setEdit={setEdit} />,
							document.body
						)}
					</>
				}
			>
				{getYouTubeTokensQuery.data && (
					<Table>
						<Thead>
							<tr>
								<th className="w-2/6">Token</th>
								<th className="w-2/6">Quota Run Out At</th>
								<th className="w-1/6">Is Expired</th>
								<th className="w-1/6"></th>
							</tr>
						</Thead>
						<Tbody>
							{getYouTubeTokensQuery.data.map(
								(t: any, i: number) => {
									return (
										<tr key={i}>
											<td className="w-2/6">{t.token}</td>
											<td className="w-2/6">
												{t.quotaRunOutAt
													? dayjs(
															t.quotaRunOutAt
													  ).format(
															"MMM DD, YYYY HH:mm:ss"
													  )
													: "Unknown"}
											</td>
											<td className="w-1/6">
												{t.isExpired
													? "isExpired"
													: "Unknown"}
											</td>
											<td className="w-1/6">
												<div className="flex justify-end items-center gap-x-1.5">
													<div className="w-fit truncate">
														<Button
															size="sm"
															onClick={() => {
																markAsAvailableMutation.mutate(
																	t.token
																);
															}}
														>
															mark as available
														</Button>
													</div>
													<button
														className="flex justify-center items-center w-6 h-6
														bg-white/5 hover:bg-white/15
														rounded cursor-pointer"
														onClick={() => {
															setTokenToDelete(
																t.token
															);
															setShowDeleteConfirmation(
																true
															);
														}}
													>
														<DeleteIcon size={15} />
													</button>
												</div>
											</td>
										</tr>
									);
								}
							)}
						</Tbody>
					</Table>
				)}
				<ConfirmDialog
					show={showDeleteConfirmation}
					setShow={setShowDeleteConfirmation}
					question={"Are you sure you want to delete this stat?"}
					onOk={() => {
						mutation.mutate();
						setShowDeleteConfirmation(false);
					}}
				/>
			</PageBlock>
		</PageContainer>
	);
};
