import { useState, useRef } from "react";
import { DatePickerProps } from "../date-picker/DatePicker";
import { YearCalendar } from "./YearCalendar";

export const YearPicker = (props: DatePickerProps) => {
	const { date, setDate } = props;

	const [show, setShow] = useState<boolean>(false);
	const calendarRef = useRef<HTMLDivElement>(null);

	return (
		<div
			className="relative
			text-sm"
			onClick={(e) => {
				/* prevent clicks from propagating to parent elements */
				e.stopPropagation();
			}}
		>
			<button
				className="w-32 px-2 py-1
				text-white/70
				bg-neutral-700
				rounded border-[1px] border-white/10 border-t-white/15
				whitespace-nowrap cursor-pointer"
				onClick={(e) => {
					e.preventDefault();
					setShow((prev) => !prev);
				}}
			>
				{date.format("YYYY")}
			</button>
			{show && (
				<div
					ref={calendarRef}
					className="absolute top-8 w-64
					border-[1px] border-white/10 border-t-white/15
					rounded overflow-hidden
					z-10"
					/* prevent clicks inside the calendar from closing it */
					onClick={(e) => e.stopPropagation()}
				>
					<YearCalendar
						date={date}
						setDate={setDate}
						setShow={setShow}
					/>
				</div>
			)}
			{/* Close the calendar when clicking outside */}
			{show && (
				<div
					className="fixed inset-0 z-0"
					onClick={() => setShow(false)} // Close the calendar
				></div>
			)}
		</div>
	);
};
