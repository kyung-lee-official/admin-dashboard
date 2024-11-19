import { Dispatch, SetStateAction, useEffect } from "react";
import { ScalableSize, Translation } from "./EditContentAvatar";

export const Scale = (props: {
	scale: number;
	setScale: Dispatch<SetStateAction<number>>;
	avatarRadius: number;
	mappedImageSize: ScalableSize;
	setMappedImageSize: Dispatch<SetStateAction<ScalableSize>>;
	imageTranslation: Translation;
	setImageTranslation: Dispatch<SetStateAction<Translation>>;
}) => {
	const {
		scale,
		setScale,
		avatarRadius,
		mappedImageSize,
		setMappedImageSize,
		imageTranslation,
		setImageTranslation,
	} = props;

	const onScaleChange = (e: any) => {
		setScale(e.target.value);
	};

	useEffect(() => {
		setMappedImageSize({
			w: mappedImageSize.w,
			h: mappedImageSize.h,
			sw: mappedImageSize.w * scale,
			sh: mappedImageSize.h * scale,
		});
		/**
		 * keep the image centered when scaling.
		 * the calculation could be a bit tricky, it would be helpful to imagine a 3*1 image,
		 * and switch scale from 1 to 2 (which makes the image 6*2),
		 * to see how the image moves.
		 */
		setImageTranslation({
			x: imageTranslation.x,
			y: imageTranslation.y,
			sx: -imageTranslation.cx * scale + avatarRadius,
			sy: -imageTranslation.cy * scale + avatarRadius,
			cx: imageTranslation.cx,
			cy: imageTranslation.cy,
			csx: imageTranslation.cx * scale,
			csy: imageTranslation.cy * scale,
		});
	}, [scale]);

	return (
		<div className="flex justify-evenly items-center w-full px-4 gap-6">
			<svg
				viewBox="0 0 24 24"
				height="24"
				width="24"
				focusable="false"
				role="img"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm3-7 2.363 2.363L14 11l5 7H5l3-4z"></path>
			</svg>
			<input
				type="range"
				id="scale"
				name="scale"
				value={scale}
				min={1}
				max={3}
				step={0.01}
				className="w-full outline-none"
				onChange={onScaleChange}
			/>
			<svg
				viewBox="0 0 24 24"
				height="32"
				width="32"
				focusable="false"
				role="img"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm3-7 2.363 2.363L14 11l5 7H5l3-4z"></path>
			</svg>
		</div>
	);
};
