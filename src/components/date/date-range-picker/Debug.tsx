import { CalendarRange } from "./Calendar";

export const Debug = (props: { calendarRange: CalendarRange }) => {
	const { calendarRange } = props;
	return (
		<div
			className="flex flex-col px-2 py-1
			bg-black/40"
		>
			<div>start: {calendarRange.start.format("MMM DD, YYYY")}</div>
			<div>end: {calendarRange.end?.format("MMM DD, YYYY")}</div>
			<div>isSelecting: {calendarRange.isSelecting.toString()}</div>
		</div>
	);
};
