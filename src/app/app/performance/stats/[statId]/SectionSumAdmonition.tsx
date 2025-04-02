export const SectionSumAdmonition = (props: { currentValue: number }) => {
	const { currentValue } = props;
	return (
		<div
			className="flex justify-center items-center w-full h-12 
			text-sm text-red-500
			bg-red-950
			rounded border-[1px] border-red-800"
		>
			The sum of all section weights must be 100, it is currently{" "}
			{currentValue}
		</div>
	);
};
