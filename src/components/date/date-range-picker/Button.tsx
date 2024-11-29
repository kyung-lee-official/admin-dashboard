import { Dispatch, SetStateAction } from "react";
import { CalendarRange } from "./Calendar";
import dayjs from "dayjs";

export const Button = (props: {
	children: React.ReactNode;
	date: dayjs.Dayjs;
	isFade: boolean;
	isStartOrEnd: boolean;
	isBetween: boolean;
	calendarRange: CalendarRange;
	setCalendarRange: Dispatch<SetStateAction<CalendarRange>>;
}) => {
	const {
		children,
		date,
		isFade,
		isStartOrEnd,
		isBetween,
		calendarRange,
		setCalendarRange,
	} = props;

	const onClick = () => {
		setCalendarRange((prev) => {
			if (!prev.isSelecting) {
				return {
					start: date,
					end: date /* temporarily set the end date to the same date */,
					isSelecting: true,
				};
			} else {
				if (prev.start.isAfter(date)) {
					return {
						start: date,
						end: prev.start,
						isSelecting: false,
					};
				}
				return {
					start: prev.start,
					end: date,
					isSelecting: false,
				};
			}
		});
	};

	if (isStartOrEnd) {
		return (
			<button
				className="w-7 h-7
				text-white
				bg-blue-500
				rounded-full"
				onClick={onClick}
			>
				{children}
			</button>
		);
	}

	if (isBetween) {
		return (
			<button
				className="w-7 h-7
				text-blue-500
				bg-blue-500/30
				rounded-full"
				onClick={onClick}
			>
				{children}
			</button>
		);
	}

	if (isFade) {
		return (
			<button
				className="w-7 h-7
				text-white/40
				rounded-full"
				onClick={onClick}
			>
				{children}
			</button>
		);
	}

	return (
		<button
			className="w-7 h-7
			text-white
			rounded-full"
			onClick={onClick}
		>
			{children}
		</button>
	);
};
