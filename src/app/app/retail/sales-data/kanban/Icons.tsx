export const GridOnOutlined = (props: { size: number }) => {
	const { size } = props;
	return (
		<svg
			focusable="false"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
		>
			<path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M8 20H4v-4h4zm0-6H4v-4h4zm0-6H4V4h4zm6 12h-4v-4h4zm0-6h-4v-4h4zm0-6h-4V4h4zm6 12h-4v-4h4zm0-6h-4v-4h4zm0-6h-4V4h4z"></path>
		</svg>
	);
};

export const PollOutlined = (props: { size: number }) => {
	const { size } = props;
	return (
		<svg
			focusable="false"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
		>
			<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"></path>
		</svg>
	);
};

export const FilterAltOutlined = (props: { size: number }) => {
	const { size } = props;
	return (
		<svg
			focusable="false"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
		>
			<path d="M7 6h10l-5.01 6.3zm-2.75-.39C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61"></path>
		</svg>
	);
};

export const SwapVert = (props: {
	size: number;
	direction: ("asc" | "desc") | null;
}) => {
	const { size, direction } = props;
	return (
		<svg
			focusable="false"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="currentColor"
		>
			<path
				d="M9 3 5 6.99h3V14h2V6.99h3z"
				fill={direction === "asc" ? "white" : ""}
			></path>
			<path
				d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99z"
				fill={direction === "desc" ? "white" : ""}
			></path>
		</svg>
	);
};
