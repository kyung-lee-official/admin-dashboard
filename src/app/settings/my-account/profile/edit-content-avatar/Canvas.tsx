import { forwardRef, MutableRefObject, useEffect } from "react";
import { CanvasSize, ScalableSize, Translation } from "./EditContentAvatar";

export type CanvasProps = {
	image: HTMLImageElement;
	imageSrc: string;
	scale: number;
	avatarRadius: number;
	imageTranslation: Translation;
	mappedImageSize: ScalableSize;
	canvasSize: CanvasSize;
	instinctMappedRatio: number;
};

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
	function Canvas(props, forwardedRef) {
		const ref = forwardedRef as MutableRefObject<HTMLCanvasElement>;
		const {
			image,
			imageSrc,
			scale,
			imageTranslation,
			avatarRadius,
			mappedImageSize,
			canvasSize,
			instinctMappedRatio,
			...otherProps
		} = props;

		useEffect(() => {
			/* draw canvas */
			if (ref.current) {
				const context = ref.current.getContext("2d");
				if (context) {
					context.clearRect(0, 0, canvasSize.w, canvasSize.h);
					/**
					 * there are two conversions happening here:
					 * 1. converting the mapped image size to scale = 1
					 * 2. converting the scale = 1 to the instrinsic size of the image
					 */
					const instrictX = -imageTranslation.x * instinctMappedRatio;
					const instrictY = -imageTranslation.y * instinctMappedRatio;
					const instrictW =
						((2 * avatarRadius) / scale) * instinctMappedRatio;
					const instrictH =
						((2 * avatarRadius) / scale) * instinctMappedRatio;
					// console.log("-------------------");
					// console.log("instrictX", instrictX);
					// console.log("instrictY", instrictY);
					// console.log("instrictW", instrictW);
					// console.log("instrictH", instrictH);
					// console.log("canvasSize.w", canvasSize.w);
					// console.log("canvasSize.h", canvasSize.h);
					context.drawImage(
						image,
						instrictX,
						instrictY,
						instrictW,
						instrictH,
						0,
						0,
						canvasSize.w,
						canvasSize.h
					);
				}
			}
		}, [imageSrc, scale, imageTranslation]);

		return (
			<div className="w-[400px] h-[400px] hidden">
				<canvas
					ref={ref}
					{...otherProps}
					width={canvasSize.w}
					height={canvasSize.h}
				></canvas>
			</div>
		);
	}
);
