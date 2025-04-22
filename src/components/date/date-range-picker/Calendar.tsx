import { Dispatch, SetStateAction, useEffect, useState } from "react";
import dayjs from "dayjs";
import { DateRange, RangePickerProps } from "./DateRangePicker";
import { Button } from "./Button";
// import { Debug } from "./Debug";
import { ChevronLeft, ChevronRight } from "./Icons";

type CalendarProps = RangePickerProps & {
	setShow: Dispatch<SetStateAction<boolean>>;
};

export type CalendarRange = DateRange & { isSelecting: boolean };

export const Calendar = (props: CalendarProps) => {
	const { range, setRange, setShow } = props;
	const [calendarRange, setCalendarRange] = useState<CalendarRange>({
		start: range.start,
		end: range.end,
		isSelecting: false,
	});
	const [displayedMonth, setDisplayedMonth] = useState<dayjs.Dayjs>(
		range.start.date(1)
	);

	const calendar: dayjs.Dayjs[] = [];
	/* first date of the month */
	const firstDate = displayedMonth.date(1);
	/* get day of the week (0-6) */
	const dayOfWeek = firstDate.day();
	new Array(dayOfWeek).fill(null).map((_, i) => {
		return calendar.push(firstDate.subtract(dayOfWeek - i, "day"));
	});
	/* get how many days in the month */
	const daysInMonth = firstDate.daysInMonth();
	new Array(daysInMonth).fill(null).map((_, i) => {
		return calendar.push(firstDate.add(i, "day"));
	});
	/* fill the rest of the calendar with the next month */
	const nextMonthFirstDate = firstDate.add(1, "month");
	if (nextMonthFirstDate.day() !== 0) {
		new Array(7 - nextMonthFirstDate.day()).fill(null).map((_, i) => {
			return calendar.push(nextMonthFirstDate.add(i, "day"));
		});
	}

	useEffect(() => {
		if (!calendarRange.isSelecting) {
			setRange({
				start: calendarRange.start,
				end: calendarRange.end,
			});
		}
	}, [calendarRange]);

	const daysHeader = ["S", "M", "T", "W", "T", "F", "S"];

	return (
		<div
			className="flex flex-col
			text-white/70"
		>
			<div
				className="flex justify-between px-4 py-2
				bg-neutral-700"
			>
				<button
					className="cursor-pointer"
					onClick={(e) => {
						e.preventDefault();
						setDisplayedMonth(displayedMonth.subtract(1, "month"));
					}}
				>
					<ChevronLeft size={16} />
				</button>
				{displayedMonth.format("MMMM YYYY")}
				<button
					className="cursor-pointer"
					onClick={(e) => {
						e.preventDefault();
						setDisplayedMonth(displayedMonth.add(1, "month"));
					}}
				>
					<ChevronRight size={16} />
				</button>
			</div>
			<div
				className="grid gap-3 grid-cols-7 px-4 pb-2
				bg-neutral-700
				[&_>_div]:flex [&_>_div]:justify-center"
			>
				{daysHeader.map((d, i) => {
					return (
						<div key={i} className="text-white">
							{d}
						</div>
					);
				})}
			</div>
			<div
				className="grid gap-3 grid-cols-7 px-4 p-2
				bg-neutral-900
				[&_>_div]:flex [&_>_div]:justify-center"
			>
				{calendar.map((d, i) => {
					if (i < dayOfWeek) {
						return (
							<Button
								key={i}
								date={d}
								isFade={true}
								isStartOrEnd={
									d.isSame(calendarRange.start, "day") ||
									d.isSame(calendarRange.end, "day")
								}
								isBetween={
									d.isAfter(calendarRange.start, "day") &&
									d.isBefore(calendarRange.end, "day")
								}
								calendarRange={calendarRange}
								setCalendarRange={setCalendarRange}
							>
								{d.date()}
							</Button>
						);
					}
					if (i < dayOfWeek + daysInMonth) {
						return (
							<Button
								key={i}
								date={d}
								isFade={false}
								isStartOrEnd={
									d.isSame(calendarRange.start, "day") ||
									d.isSame(calendarRange.end, "day")
								}
								isBetween={
									d.isAfter(calendarRange.start, "day") &&
									d.isBefore(calendarRange.end, "day")
								}
								calendarRange={calendarRange}
								setCalendarRange={setCalendarRange}
							>
								{d.date()}
							</Button>
						);
					}
					return (
						<Button
							key={i}
							date={d}
							isFade={true}
							isStartOrEnd={
								d.isSame(calendarRange.start, "day") ||
								d.isSame(calendarRange.end, "day")
							}
							isBetween={
								d.isAfter(calendarRange.start, "day") &&
								d.isBefore(calendarRange.end, "day")
							}
							calendarRange={calendarRange}
							setCalendarRange={setCalendarRange}
						>
							{d.date()}
						</Button>
					);
				})}
			</div>
			{/* <Debug calendarRange={calendarRange} /> */}
		</div>
	);
};
