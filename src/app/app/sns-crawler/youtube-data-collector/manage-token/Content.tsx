"use client";

import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
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
	SnsYouTubeDataQK,
} from "@/utils/api/app/sns-crawler/youtube-data-collector";
import { queryClient } from "@/utils/react-query/react-query";
import { YouTubeToken } from "@/utils/types/app/sns-crawler";
import { useMutation, useQuery } from "@tanstack/react-query";
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

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Manage Token</div>
					<TitleMoreMenu
						items={[
							{
								text: "Add Token",
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
				</div>
				{getYouTubeTokensQuery.data && (
					<table
						className="w-full
						text-sm text-white/50"
					>
						<tbody className="[&_>_tr_>_td]:px-2 [&_>_tr_>_td]:py-1">
							{getYouTubeTokensQuery.data.map(
								(t: any, i: number) => {
									return (
										<tr
											key={i}
											className="flex items-center px-3 py-1 gap-6
											text-sm
											border-t-[1px] border-white/10"
										>
											<td className="w-3/6">{t.token}</td>
											<td className="w-2/6">
												{t.quotaRunOutAt}
											</td>
											<td className="flex justify-end w-1/6">
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
											</td>
										</tr>
									);
								}
							)}
						</tbody>
					</table>
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
			</div>
		</div>
	);
};
