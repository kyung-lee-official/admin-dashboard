import dayjs from "dayjs";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Calendar } from "./Calendar";

export type DatePickerProps = {
	date: dayjs.Dayjs;
	setDate: Dispatch<SetStateAction<dayjs.Dayjs>>;
};

export const DatePicker = (props: DatePickerProps) => {
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
				className="px-2 py-1
				text-white/70
				bg-neutral-700
				rounded cursor-pointer"
				onClick={(e) => {
					e.preventDefault();
					setShow((prev) => !prev);
				}}
			>
				{date.format("MMM DD, YYYY")}
			</button>
			{show && (
				<div
					ref={calendarRef}
					className="absolute top-8 w-64
					rounded overflow-hidden
					z-10"
					/* prevent clicks inside the calendar from closing it */
					onClick={(e) => e.stopPropagation()}
				>
					<Calendar date={date} setDate={setDate} setShow={setShow} />
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
