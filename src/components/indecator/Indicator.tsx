type IndicatorProps = {
	isActive: boolean;
	labelText?: string;
};

export const Indicator = (props: IndicatorProps) => {
	const { isActive, labelText } = props;
	return (
		<div className="flex items-center">
			<div
				className={`w-2.5 h-2.5 mr-2 ${
					isActive ? "bg-green-500" : ""
				} rounded-full`}
			/>
			{labelText && (
				<div className="text-sm text-white/50">{labelText}</div>
			)}
		</div>
	);
};
