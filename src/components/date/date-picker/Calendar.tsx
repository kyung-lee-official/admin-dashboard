import { Dispatch, SetStateAction, useState } from "react";
import { DatePickerProps } from "./DatePicker";
import { ChevronLeft, ChevronRight } from "../icons/arrows";
import dayjs from "dayjs";

const Button = (props: {
	children: React.ReactNode;
	isFade: boolean;
	isSelected: boolean;
	onClick: () => void;
}) => {
	const { children, isFade, isSelected, onClick } = props;

	if (isSelected) {
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

	if (isFade) {
		return (
			<button
				className="w-7 h-7
				text-white/40 hover:text-blue-500
				hover:bg-blue-500/30
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
			text-white hover:text-blue-500
			hover:bg-blue-500/30
			rounded-full"
			onClick={onClick}
		>
			{children}
		</button>
	);
};

type CalendarProps = DatePickerProps & {
	setShow: Dispatch<SetStateAction<boolean>>;
};

export const Calendar = (props: CalendarProps) => {
	const { date, setDate, setShow } = props;
	const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(date);

	const calendar: dayjs.Dayjs[] = [];
	/* first date of the month */
	const firstDate = calendarDate.date(1);
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
					onClick={(e) => {
						e.preventDefault();
						setCalendarDate(calendarDate.subtract(1, "month"));
					}}
				>
					<ChevronLeft size={16} />
				</button>
				{calendarDate.format("MMMM YYYY")}
				<button
					onClick={(e) => {
						e.preventDefault();
						setCalendarDate(calendarDate.add(1, "month"));
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
								isFade={true}
								isSelected={d.isSame(date, "day")}
								onClick={() => {
									setDate(d);
									setShow(false);
								}}
							>
								{d.date()}
							</Button>
						);
					}
					if (i < dayOfWeek + daysInMonth) {
						return (
							<Button
								key={i}
								isFade={false}
								isSelected={d.isSame(date, "day")}
								onClick={() => {
									setDate(d);
									setShow(false);
								}}
							>
								{d.date()}
							</Button>
						);
					}
					return (
						<Button
							key={i}
							isFade={true}
							isSelected={d.isSame(date, "day")}
							onClick={() => {
								setDate(d);
								setShow(false);
							}}
						>
							{d.date()}
						</Button>
					);
				})}
			</div>
		</div>
	);
};
