export type ImageType = "jpg" | "jpeg" | "png" | "gif";
export type VideoType = "mp4" | "avi";

export function isImageType(type: string): type is ImageType {
	return ["jpg", "jpeg", "png", "gif"].includes(type);
}

export function isVideoType(type: string): type is VideoType {
	return ["mp4", "avi"].includes(type);
}
