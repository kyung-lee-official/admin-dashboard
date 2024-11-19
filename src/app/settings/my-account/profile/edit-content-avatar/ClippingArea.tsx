import {
	Dispatch,
	forwardRef,
	MutableRefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { Scale } from "./Scale";
import { Mask } from "./Mask";
import useResizeObserver from "./useResizeObserver";
import { ScalableSize, Translation } from "./EditContentAvatar";
import { clamp } from "@/utils/math/math";

export type ClippingAreaProps = {
	image: HTMLImageElement;
	imageSrc: string;
	scale: number;
	setScale: Dispatch<SetStateAction<number>>;
	avatarRadius: number;
	setAvatarRadius: Dispatch<SetStateAction<number>>;
	mappedImageSize: ScalableSize;
	setMappedImageSize: Dispatch<SetStateAction<ScalableSize>>;
	imageTranslation: Translation;
	setImageTranslation: Dispatch<SetStateAction<Translation>>;
	instinctMappedRatio: number;
	setInstinctMappedRatio: Dispatch<SetStateAction<number>>;
};

export const ClippingArea = forwardRef<HTMLCanvasElement, ClippingAreaProps>(
	function ClippingArea(props, forwardedRef) {
		/* canvasRef is useless at this moment, but it's recommended to keep it in this component */
		const canvasRef = forwardedRef as MutableRefObject<HTMLCanvasElement>;
		const {
			image,
			imageSrc,
			scale,
			setScale,
			avatarRadius,
			setAvatarRadius,
			imageTranslation,
			setImageTranslation,
			mappedImageSize,
			setMappedImageSize,
			setInstinctMappedRatio,
			...otherProps
		} = props;

		const imageRef = useRef<HTMLImageElement>(null);

		/* draggableSize is the size of the draggable area */
		const draggableAreaRef = useRef<HTMLDivElement>(null);
		const draggableSize = useResizeObserver(draggableAreaRef);
		const [isDragging, setIsDragging] = useState<boolean>(false);

		/* set initial image info */
		useEffect(() => {
			image.src = imageSrc;
			image.onload = () => {
				/* get image aspect ratio from intrinsic image width and height */
				const imageAspectRatio = image.width / image.height;
				const avatarRadius = draggableSize.width / 2;
				if (imageAspectRatio >= 1) {
					/* horizontal image or square image */
					const width = draggableSize.height * imageAspectRatio;
					const height = draggableSize.height;
					setMappedImageSize({
						w: width,
						h: height,
						sw: width,
						sh: height,
					});
					setImageTranslation({
						x: -(width / 2 - avatarRadius),
						y: 0,
						sx: -(width / 2 - avatarRadius),
						sy: 0,
						cx: width / 2,
						cy: avatarRadius,
						csx: width / 2,
						csy: avatarRadius,
					});
					setInstinctMappedRatio(image.width / width);
				} else {
					/* vertical image */
					const width = draggableSize.width;
					const height = draggableSize.width / imageAspectRatio;
					setMappedImageSize({
						w: width,
						h: height,
						sw: width,
						sh: height,
					});
					setImageTranslation({
						x: 0,
						y: -(height / 2 - avatarRadius),
						sx: 0,
						sy: -(height / 2 - avatarRadius),
						cx: avatarRadius,
						cy: height / 2,
						csx: avatarRadius,
						csy: height / 2,
					});
					setInstinctMappedRatio(image.width / width);
				}
				setAvatarRadius(avatarRadius);
			};

			window.addEventListener("pointerup", onPointerUp);
			return () => {
				window.removeEventListener("pointerup", onPointerUp);
			};
		}, [imageSrc]);

		const onPointerUp = (e: any) => {
			setIsDragging(false);
		};

		const onPointerDown = (e: any) => {
			setIsDragging(true);
		};

		const onPointerMove = (e: any) => {
			if (isDragging) {
				/**
				 * If pointer move to the right, e.movementX > 0
				 * If pointer move to the left, e.movementX < 0
				 * we need to set boundaries (clamp) for the image to stay in the cropper area.
				 */
				/* always negative */
				const imageTranslationSX = clamp(
					imageTranslation.sx + e.movementX,
					-(mappedImageSize.sw - draggableSize.width),
					0
				);
				/* always negative */
				const imageTranslationSY = clamp(
					imageTranslation.sy + e.movementY,
					-(mappedImageSize.sh - draggableSize.width),
					0
				);
				setImageTranslation({
					x: imageTranslationSX / scale,
					y: imageTranslationSY / scale,
					sx: imageTranslationSX,
					sy: imageTranslationSY,
					cx: (-imageTranslationSX + avatarRadius) / scale,
					cy: (-imageTranslationSY + avatarRadius) / scale,
					csx: -imageTranslationSX + avatarRadius,
					csy: -imageTranslationSY + avatarRadius,
				});
			}
		};

		return (
			<div
				className="flex-[1_0_100px] flex flex-col px-6 py-4 gap-3
				border-b-[1px] border-white/10"
			>
				<div
					ref={draggableAreaRef}
					className="relative flex justify-center items-center w-full aspect-square
					bg-neutral-800
					rounded-md cursor-grab"
				>
					{/* The width of mappedImageSize can be larger than the draggable area, need an overflow-hidden container to hide the image outside the draggable area */}
					<div className="w-full aspect-square overflow-hidden rounded-md">
						<div
							className="rounded-md"
							style={{
								width: `${mappedImageSize.sw}px`,
							}}
						>
							{imageSrc && (
								<img
									ref={imageRef}
									src={imageSrc}
									alt=""
									width={`${mappedImageSize.sw}px`}
									/* When scaled, the value of imageTranslation doesn't match the actual pixel value, so need to divide by scale */
									style={{
										transform: `translateX(${imageTranslation.sx}px) translateY(${imageTranslation.sy}px)`,
									}}
									className="select-none"
									onDragStart={(e) => {
										e.preventDefault();
									}}
									onPointerDown={onPointerDown}
									onPointerMove={onPointerMove}
								/>
							)}
						</div>
					</div>
					<Mask />
				</div>
				<Scale
					scale={scale}
					setScale={setScale}
					avatarRadius={avatarRadius}
					mappedImageSize={mappedImageSize}
					setMappedImageSize={setMappedImageSize}
					imageTranslation={imageTranslation}
					setImageTranslation={setImageTranslation}
				/>
			</div>
		);
	}
);
