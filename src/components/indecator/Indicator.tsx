type IndicatorProps = {
	isActive: boolean;
	labelText?: string;
};

export const Indicator = (props: IndicatorProps) => {
	const { isActive, labelText } = props;
	return (
		<div className="flex items-center">
			<div
				className={`w-2.5 h-2.5 mx-4 ${
					isActive ? "bg-green-500" : "border-1 border-white/30"
				} rounded-full`}
			/>
			{labelText && (
				<div className="text-sm text-white/50">{labelText}</div>
			)}
		</div>
	);
};
