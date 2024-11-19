import { CanvasProps } from "./Canvas";
import { ClippingAreaProps } from "./ClippingArea";

export const Debug = (props: ClippingAreaProps & CanvasProps) => {
	const {
		image,
		imageSrc,
		scale,
		setScale,
		avatarRadius,
		setAvatarRadius,
		mappedImageSize,
		setMappedImageSize,
		imageTranslation,
		setImageTranslation,
		instinctMappedRatio,
		setInstinctMappedRatio,
		canvasSize,
		...otherProps
	} = props;

	return (
		<div
			className="fixed top-0 right-0 min-w-72 p-2 m-2
			flex flex-col gap-1.5
			bg-white/30 text-white/70"
		>
			<div>Debug</div>
			{/* <div>imageSrc: {imageSrc}</div> */}
			<div>scale: {scale}</div>
			<div>avatarRadius: {avatarRadius}</div>
			<div>mappedImageSize.w: {mappedImageSize.w}</div>
			<div>mappedImageSize.h: {mappedImageSize.h}</div>
			<div>mappedImageSize.sw: {mappedImageSize.sw}</div>
			<div>mappedImageSize.sh: {mappedImageSize.sh}</div>
			<div>imageTranslation.x: {imageTranslation.x}</div>
			<div>imageTranslation.y: {imageTranslation.y}</div>
			<div>imageTranslation.sx: {imageTranslation.sx}</div>
			<div>imageTranslation.sy: {imageTranslation.sy}</div>
			<div>imageTranslation.cx: {imageTranslation.cx}</div>
			<div>imageTranslation.cy: {imageTranslation.cy}</div>
			<div>imageTranslation.csx: {imageTranslation.csx}</div>
			<div>imageTranslation.csy: {imageTranslation.csy}</div>
			<div>-----------------------------------------</div>
			<div>instinctMappedRatio: {instinctMappedRatio}</div>
		</div>
	);
};
