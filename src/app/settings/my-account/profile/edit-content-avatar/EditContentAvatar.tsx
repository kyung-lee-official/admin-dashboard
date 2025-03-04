"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import COS from "cos-js-sdk-v5";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import { MembersQK, uploadMyAvatar } from "@/utils/api/members";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/button/Button";
import { CloseIcon } from "@/components/icons/Icons";
import { ClippingArea } from "./ClippingArea";
import { Canvas } from "./Canvas";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
// import { Debug } from "./Debug";

export type CanvasSize = {
	w: number;
	h: number;
};

export type ScalableSize = {
	w: number /* origin mapped width */;
	h: number /* origin mapped height */;
	sw: number /* scale mapped width */;
	sh: number /* scale mapped height */;
};
export type Translation = {
	x: number;
	y: number;
	sx: number /* scale x */;
	sy: number /* scale y */;
	cx: number /* x of scale center, this value starts from 0, should always be positive, note that it uses a different coordinate system */;
	cy: number /* y of scale center, this value starts from 0, should always be positive, note that it uses a different coordinate system */;
	csx: number /* x of scale center when image was scale */;
	csy: number /* y of scale center when image was scale */;
};

export const EditContentAvatar = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.AVATAR;
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	/* canvas is used to clip the image to a square */
	const canvasSize: CanvasSize = {
		w: 400,
		h: 400,
	};

	/* image element */
	const [image, setImage] = useState<HTMLImageElement>(new Image());
	/* image source */
	const [imageSrc, setImageSrc] = useState<string>("");
	const [scale, setScale] = useState<number>(1);
	const [avatarRadius, setAvatarRadius] = useState<number>(0);
	/* size of image that is mapped to the draggable area */
	const [mappedImageSize, setMappedImageSize] = useState<ScalableSize>({
		w: 0,
		h: 0,
		sw: 0,
		sh: 0,
	});
	/**
	 * Set the translation of the image.
	 * Initially, the image is centered in the draggable area
	 * and the translation is (0, 0).
	 * If imageTranslation.x is positive, the image will move to the right, and vice versa.
	 * If imageTranslation.y is positive, the image will move down, and vice versa.
	 */
	const [imageTranslation, setImageTranslation] = useState<Translation>({
		x: 0,
		y: 0,
		sx: 0,
		sy: 0,
		cx: 0,
		cy: 0,
		csx: 0,
		csy: 0,
	});
	/**
	 * Instinct image width divide by mapped image width (non-scale, which is mappedImageSize.w)
	 */
	const [instinctMappedRatio, setInstinctMappedRatio] = useState(1);

	const listenerRef = useRef<HTMLDivElement>(null);
	const [isChanged, setIsChanged] = useState(false);
	const isChangedRef = useRef(isChanged);
	const _setIsChanged = (data: any) => {
		isChangedRef.current = data;
		setIsChanged(data);
	};
	const [showUnsaved, setShowUnsaved] = useState(false);

	const panelRef = useRef<HTMLDivElement>(null);
	// const unsavedDialogRef = useRef<HTMLDialogElement>(null);
	const avatarInputRef = useRef<HTMLInputElement>(null);
	/* canvas is hidden and used to clip the image only */
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const updateAvatarMutation = useMutation({
		mutationFn: async () => {
			if (canvasRef.current) {
				const blob = await new Promise((resolve) => {
					return canvasRef.current!.toBlob(resolve);
				});
				const res = await uploadMyAvatar(blob as Blob, jwt);
				return res;
			}
		},
		onSuccess: () => {
			/* Server response */
			if (panelRef.current) {
				// panelRef.current.close();
				setEdit({ show: false, id: editId });
				queryClient.invalidateQueries({
					queryKey: [MembersQK.GET_AVATAR_BY_ID],
				});
			}
			/* Tencent COS response */
			// 	if (panelRef.current) {
			// 		panelRef.current.close();
			// 		queryClient.invalidateQueries({
			// 			queryKey: [
			// 				MembersQK.GET_AVATAR_BY_ID,
			// 				jwt,
			// 			],
			// 		});
			// 	}
		},
	});

	const onFileChange = async (e: any) => {
		const file = e.target.files[0];
		setImageSrc(URL.createObjectURL(file));
		_setIsChanged(true);
		if (avatarInputRef.current) {
			/* This is to clear the input file value, so that the same file can be uploaded again */
			avatarInputRef.current.value = "";
		}
	};

	function quit() {
		if (isChangedRef.current) {
			setShowUnsaved(true);
		} else {
			setEdit({ show: false, id: editId });
		}
	}

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (!listenerRef.current) {
				return;
			}
			if (listenerRef.current === event.target) {
				quit();
			}
		}
		listenerRef.current?.addEventListener("click", handleClickOutside);
		return () => {
			listenerRef.current?.removeEventListener(
				"click",
				handleClickOutside
			);
		};
	}, [isChanged]);

	return (
		<div
			ref={listenerRef}
			className="w-full h-svh
			flex justify-center items-center"
		>
			<div
				ref={panelRef}
				className="flex flex-col w-full max-w-[400px] m-2
				text-white/90
				bg-neutral-900
				rounded-lg border-[1px] border-neutral-700 border-t-neutral-600"
			>
				<div
					className="flex-[0_0_61px] flex justify-between px-6 py-4
					font-semibold text-lg
					border-b-[1px] border-white/10"
				>
					<div>Change Avatar</div>
					<button
						className="flex justify-center items-center w-7 h-7
						text-white/50
						hover:bg-white/10 rounded-md"
						onClick={() => {
							quit();
						}}
					>
						<CloseIcon size={15} />
					</button>
				</div>
				<div className="flex-[1_0_100px] flex flex-col">
					<Canvas
						ref={canvasRef}
						image={image}
						imageSrc={imageSrc}
						scale={scale}
						imageTranslation={imageTranslation}
						avatarRadius={avatarRadius}
						mappedImageSize={mappedImageSize}
						canvasSize={canvasSize}
						instinctMappedRatio={instinctMappedRatio}
					/>
					<ClippingArea
						ref={canvasRef}
						image={image}
						imageSrc={imageSrc}
						scale={scale}
						setScale={setScale}
						avatarRadius={avatarRadius}
						setAvatarRadius={setAvatarRadius}
						imageTranslation={imageTranslation}
						setImageTranslation={setImageTranslation}
						mappedImageSize={mappedImageSize}
						setMappedImageSize={setMappedImageSize}
						instinctMappedRatio={instinctMappedRatio}
						setInstinctMappedRatio={setInstinctMappedRatio}
					/>
					{/* <Debug
						image={image}
						imageSrc={imageSrc}
						scale={scale}
						setScale={setScale}
						avatarRadius={avatarRadius}
						setAvatarRadius={setAvatarRadius}
						imageTranslation={imageTranslation}
						setImageTranslation={setImageTranslation}
						mappedImageSize={mappedImageSize}
						setMappedImageSize={setMappedImageSize}
						instinctMappedRatio={instinctMappedRatio}
						setInstinctMappedRatio={setInstinctMappedRatio}
						canvasSize={canvasSize}
					/> */}
					<div className="flex-[0_0_61px] flex justify-between px-6 py-4 gap-1.5">
						<input
							ref={avatarInputRef}
							type="file"
							accept="image/png,image/jpeg,image/jpg"
							onChange={onFileChange}
							className="hidden"
						/>
						<Button
							size="sm"
							disabled={updateAvatarMutation.isPending}
							onClick={() => {
								avatarInputRef.current?.click();
							}}
						>
							Select
						</Button>
						<div className="flex gap-4">
							<Button
								color="cancel"
								size="sm"
								onClick={(e) => {
									e.preventDefault();
									quit();
								}}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								disabled={updateAvatarMutation.isPending}
								onClick={(e) => {
									e.preventDefault();
									updateAvatarMutation.mutate();
								}}
							>
								Save
							</Button>
						</div>
					</div>
				</div>
			</div>
			<ConfirmDialog
				show={showUnsaved}
				setShow={setShowUnsaved}
				question="Are you sure you want to leave?"
				confirmText="Continue"
				onOk={() => {
					setEdit({ show: false, id: edit.id });
				}}
			/>
		</div>
	);
};
