export const UnknownFileTypeIcon = (props: { title: string; size: number }) => {
	const { title, size } = props;
	return (
		<div
			className="flex justify-center items-center w-full h-full p-4
			rounded-md"
			title={title}
		>
			<svg
				viewBox="0 0 16 16"
				height="100%"
				width="100%"
				role="img"
				className="fill-white/40"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"></path>
			</svg>
		</div>
	);
};

export const ItemLoading = () => {
	return (
		<div
			className="w-full h-full p-8
			bg-black/20
			animate-pulse
			text-black/50"
		>
			<ImageIcon />
		</div>
	);
};

const ImageIcon = () => {
	return (
		<svg
			viewBox="0 0 16 16"
			height="100%"
			width="100%"
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
			<path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"></path>
		</svg>
	);
};

export const DownloadIcon = ({ size, fill }: any) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			fill="white"
			viewBox="0 0 16 16"
		>
			<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"></path>
			<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"></path>
		</svg>
	);
};

export const PreviewIcon = ({ size, fill }: any) => {
	return (
		<svg
			viewBox="64 64 896 896"
			focusable="false"
			width={size}
			height={size}
			fill="white"
		>
			<path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
		</svg>
	);
};

export const DeleteIcon = ({ size, fill }: any) => {
	return (
		<svg
			viewBox="64 64 896 896"
			focusable="false"
			data-icon="delete"
			width={size}
			height={size}
			fill="white"
		>
			<path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
		</svg>
	);
};
