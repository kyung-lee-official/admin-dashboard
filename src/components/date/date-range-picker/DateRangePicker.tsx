import dayjs from "dayjs";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Calendar } from "./Calendar";

export type DateRange = {
	start: dayjs.Dayjs;
	end: dayjs.Dayjs;
};

export type RangePickerProps = {
	range: DateRange;
	setRange: Dispatch<SetStateAction<DateRange>>;
};

export const DateRangePicker = (props: RangePickerProps) => {
	const { range, setRange } = props;

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
				className="px-2 py-1
				text-white/70
				bg-neutral-700
				rounded"
			>
				{range.start.format("MMM DD, YYYY")} -{" "}
				{range.end.format("MMM DD, YYYY")}
			</button>
			{show && (
				<div
					ref={calendarRef}
					className="absolute top-8 w-64
					border-[1px] border-white/10 border-t-white/15
					rounded overflow-hidden
					z-10"
				>
					<Calendar
						range={range}
						setRange={setRange}
						setShow={setShow}
					/>
				</div>
			)}
		</div>
	);
};
