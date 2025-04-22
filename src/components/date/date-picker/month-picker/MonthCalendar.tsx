import { Dispatch, SetStateAction, useMemo, useState } from "react";
import dayjs from "dayjs";
import { DatePickerProps } from "../date-picker/DatePicker";
import { ChevronLeft, ChevronRight } from "./Icons";

type CalendarProps = DatePickerProps & {
	setShow: Dispatch<SetStateAction<boolean>>;
};

export const MonthCalendar = (props: CalendarProps) => {
	const { date, setDate, setShow } = props;
	const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(date);

	const calendar = useMemo(() => {
		return Array.from({ length: 12 }, (_, i) =>
			calendarDate.set("month", i).startOf("month")
		);
	}, [calendarDate]);

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
						setCalendarDate(calendarDate.subtract(1, "year"));
					}}
				>
					<ChevronLeft size={16} />
				</button>
				{calendarDate.format("YYYY")}
				<button
					className="cursor-pointer"
					onClick={(e) => {
						e.preventDefault();
						setCalendarDate(calendarDate.add(1, "year"));
					}}
				>
					<ChevronRight size={16} />
				</button>
			</div>
			<div
				className="grid gap-3 grid-cols-4 px-4 p-2
				bg-neutral-900
				[&_>_div]:flex [&_>_div]:justify-center"
			>
				{calendar.map((m, i) => {
					if (m.isSame(date, "month")) {
						return (
							<button
								key={i}
								onClick={() => {
									setDate(m);
									setShow(false);
								}}
								className="w-10 h-10 
								text-white
								bg-blue-500
								rounded-full cursor-pointer"
							>
								{m.format("MMM")}
							</button>
						);
					}
					return (
						<button
							key={i}
							onClick={() => {
								setDate(m);
								setShow(false);
							}}
							className="w-10 h-10 
							hover:bg-blue-500/30
							rounded-full cursor-pointer"
						>
							{m.format("MMM")}
						</button>
					);
				})}
			</div>
		</div>
	);
};
