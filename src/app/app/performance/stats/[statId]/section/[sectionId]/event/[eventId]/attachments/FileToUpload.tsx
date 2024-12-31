import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ItemLoading, UnknownFileTypeIcon } from "./Icons";
import { isImageType, isVideoType } from "./types";
import { Square } from "./Square";
import { queryClient } from "@/utils/react-query/react-query";
import {
	PerformanceQK,
	uploadAttachmentsByEventId,
} from "@/utils/api/app/performance";
import { useAuthStore } from "@/stores/auth";

export const FileToUpload = (props: {
	eventId: number;
	file: File;
	setUploadList: Dispatch<SetStateAction<File[]>>;
}) => {
	const { eventId, file, setUploadList } = props;
	const filetype = file.name.split(".").pop() as string;

	const jwt = useAuthStore((state) => state.jwt);
	const [url, setUrl] = useState<string>();
	const [progress, setProgress] = useState(0);

	const mutation = useMutation({
		mutationFn: async () => {
			const formData = new FormData();
			formData.append("file", file);
			const data = await uploadAttachmentsByEventId(
				eventId,
				formData,
				setProgress,
				jwt
			);
			return data;
		},
		onSuccess: () => {
			setProgress(1);
			/* remove the uploaded file from the list */
			setUploadList((prev) => {
				return prev.filter((item) => item.name !== file.name);
			});

			/* update the display list */
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_ATTACHMENT_LIST],
			});
		},
	});

	useEffect(() => {
		if (file) {
			setUrl(URL.createObjectURL(file));
			mutation.mutate();
		}
	}, []);

	if (!url) {
		return <ItemLoading />;
	}

	return (
		<div>
			<Square>
				{url ? (
					<>
						{isImageType(filetype) ? (
							<img
								src={url}
								alt={file.name}
								className={`object-cover w-full h-full
								${progress === 1 ? "opacity-100" : "opacity-50"}`}
							/>
						) : isVideoType(filetype) ? (
							<video
								src={url}
								className={`object-cover w-full h-full
								${progress === 1 ? "opacity-100" : "opacity-50"}`}
							/>
						) : (
							/* unknown file type */
							<div
								className={
									progress === 1
										? "opacity-100"
										: "opacity-50"
								}
							>
								<UnknownFileTypeIcon
									title={file.name}
									size={100}
								/>
							</div>
						)}
						<div className="absolute left-0 right-0 bottom-0 h-1">
							<div
								className={`h-full
								bg-sky-400 ${progress === 1 && "hidden"}`}
								style={{
									width: `${progress * 100}%`,
								}}
							/>
						</div>
					</>
				) : (
					<ItemLoading />
				)}
			</Square>
			<div
				title={file.name}
				className="text-white/50 text-sm
				overflow-hidden whitespace-nowrap text-ellipsis
				cursor-default"
			>
				{file.name}
			</div>
		</div>
	);
};
