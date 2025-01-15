import { useState, useRef, useEffect, useCallback } from "react";
import { DatePickerProps } from "../date-picker/DatePicker";
import { YearCalendar } from "./YearCalendar";

export const YearPicker = (props: DatePickerProps) => {
	const { date, setDate } = props;

	const [show, setShow] = useState<boolean>(false);

	const entryRef = useRef<HTMLButtonElement>(null);
	const calendarRef = useRef<HTMLDivElement>(null);

	const handleClick = useCallback((e: any) => {
		if (entryRef.current) {
			if (
				e.target === entryRef.current ||
				entryRef.current.contains(e.target)
			) {
				/* entry clicked */
				setShow((state) => {
					return !state;
				});
			} else {
				if (calendarRef.current) {
					/* menu clicked */
					if (
						e.target === calendarRef.current ||
						calendarRef.current.contains(e.target)
					) {
						/* inside clicked, do nothing or hide menu, up to you */
						// setShow(false);
					} else {
						/* outside clicked */
						setShow(false);
					}
				}
			}
		}
	}, []);

	useEffect(() => {
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, []);

	return (
		<div
			className="relative
			text-sm"
		>
			<button
				ref={entryRef}
				className="w-32 px-2 py-1
				text-white/70
				bg-neutral-700
				rounded border-[1px] border-white/10 border-t-white/15
				whitespace-nowrap"
				onClick={(e) => {
					e.preventDefault();
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
				>
					<YearCalendar
						date={date}
						setDate={setDate}
						setShow={setShow}
					/>
				</div>
			)}
		</div>
	);
};
