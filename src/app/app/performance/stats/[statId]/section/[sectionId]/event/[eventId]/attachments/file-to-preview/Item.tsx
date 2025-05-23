import {
	Dispatch,
	ImgHTMLAttributes,
	SetStateAction,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import {
	DeleteIcon,
	DownloadIcon,
	ItemLoading,
	PreviewIcon,
	UnknownFileTypeIcon,
} from "../Icons";
import { Square } from "../Square";
import { isImageType, isVideoType } from "../types";
import { useMutation } from "@tanstack/react-query";
import { getAttachment } from "@/utils/api/app/performance";
import { useAuthStore } from "@/stores/auth";
import { ConfirmDialogWithButton } from "@/components/confirm-dialog/ConfirmDialogWithButton";

type FileProps = {
	name: string;
	question: string;
	/* the function to call when the delete operation is confirmed in the dialog */
	onDelete: Function;
};

const ThumbnailMask = (props: {
	eventId: number;
	name: string;
	question: string;
	setIsZoomOut: Dispatch<SetStateAction<boolean>>;
	onDelete: Function;
}) => {
	const { eventId, name, question, setIsZoomOut, onDelete } = props;
	const filetype = name.split(".").pop() as string;

	const jwt = useAuthStore((state) => state.jwt);

	const [showThumbnailMask, setShowThumbnailMask] = useState(false);

	const downloadMutation = useMutation({
		mutationFn: async () => {
			const blob = await getAttachment(eventId, name, jwt);
			/* download the file */
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = name;
			a.click();
			URL.revokeObjectURL(url); /* free up memory */
		},
	});

	return (
		<div
			className="absolute top-0 right-0 bottom-0 left-0"
			onMouseOver={() => {
				setShowThumbnailMask(true);
			}}
			onMouseOut={() => {
				setShowThumbnailMask(false);
			}}
		>
			{showThumbnailMask && (
				<div
					className="absolute top-0 right-0 bottom-0 left-0
					flex justify-center items-center gap-4
					bg-black/50"
				>
					{isImageType(filetype) || isVideoType(filetype) ? (
						/* image or video file type */
						<button
							onClick={() => {
								setIsZoomOut(true);
							}}
						>
							<PreviewIcon size={16} />
						</button>
					) : (
						/* unknown file type */
						<button
							onClick={() => {
								downloadMutation.mutate();
							}}
						>
							<DownloadIcon size={16} />
						</button>
					)}
					<ConfirmDialogWithButton
						question={question}
						onOk={() => {
							onDelete();
						}}
					>
						<DeleteIcon size={15} />
					</ConfirmDialogWithButton>
				</div>
			)}
		</div>
	);
};

export const Item = (
	props: ImgHTMLAttributes<HTMLImageElement> &
		FileProps & { eventId: number; isLoading: boolean }
) => {
	const {
		isLoading,
		eventId,
		src,
		/* width of the image without zoom */ width,
		name,
		question,
		onDelete,
	} = props;
	const filetype = name.split(".").pop() as string;

	const imageRef = useRef<HTMLImageElement>(null);

	const [isZoomOut, setIsZoomOut] = useState(false);

	if (isLoading) {
		return (
			<div>
				<Square>
					<ItemLoading />
				</Square>
				<div
					title={name}
					className="text-white/50 text-sm
					overflow-hidden whitespace-nowrap text-ellipsis
					cursor-default"
				>
					{name}
				</div>
			</div>
		);
	}

	return (
		<div>
			<Square>
				{isImageType(filetype) ? (
					<img ref={imageRef} src={src} width={width} alt={name} />
				) : isVideoType(filetype) ? (
					<video
						src={src}
						autoPlay
						loop
						muted
						className={"w-full h-full"}
					/>
				) : (
					/* unknown file type */
					<div
						className="relative
						flex justify-center items-center w-28 h-28 gap-2
						bg-white/50"
					>
						<div
							className="flex justify-center items-center w-full h-full
							bg-black/50"
						>
							<UnknownFileTypeIcon title={name} size={100} />
						</div>
					</div>
				)}
				<ThumbnailMask
					eventId={eventId}
					name={name}
					question={question}
					setIsZoomOut={setIsZoomOut}
					onDelete={onDelete}
				/>
				{isZoomOut &&
					createPortal(
						<div
							className="fixed top-0 right-0 bottom-0 left-0
							flex justify-center items-center
							bg-black/50
							z-10"
							onClick={() => {
								setIsZoomOut(false);
							}}
						>
							<div
								className="flex justify-center items-center w-fit max-w-[95%] h-[90svh]
								overflow-auto hide-scrollbar"
							>
								{isImageType(filetype) ? (
									<img
										onClick={(e) => {
											e.stopPropagation();
										}}
										src={src}
										alt={name}
									/>
								) : (
									<video
										onClick={(e) => {
											e.stopPropagation();
										}}
										src={src}
										controls
									/>
								)}
							</div>
						</div>,
						document.body
					)}
			</Square>
			<div
				title={name}
				className="text-white/50 text-sm
				overflow-hidden whitespace-nowrap text-ellipsis
				cursor-default"
			>
				{name}
			</div>
		</div>
	);
};
