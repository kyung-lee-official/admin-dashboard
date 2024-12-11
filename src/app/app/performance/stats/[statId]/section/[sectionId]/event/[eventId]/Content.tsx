export const Content = (props: {
	statId: string;
	sectionId: string;
	eventId: string;
}) => {
	const { statId, sectionId, eventId } = props;
	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 mx-auto gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				{statId} {sectionId} {eventId}
			</div>
		</div>
	);
};
