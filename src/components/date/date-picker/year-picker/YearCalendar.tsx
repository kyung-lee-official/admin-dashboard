import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { DatePickerProps } from "../DatePicker";
import dayjs from "dayjs";
import { cluster } from "radash";
import { ChevronLeft, ChevronRight } from "../../icons/arrows";

const Button = (props: {
	children: React.ReactNode;
	isSelected: boolean;
	onClick: () => void;
}) => {
	const { children, isSelected, onClick } = props;

	if (isSelected) {
		return (
			<button
				className="h-7
				text-white
				bg-blue-500
				rounded"
				onClick={onClick}
			>
				{children}
			</button>
		);
	}

	return (
		<button
			className="h-7
			text-white hover:text-blue-500
			hover:bg-blue-500/30
			rounded"
			onClick={onClick}
		>
			{children}
		</button>
	);
};

type CalendarProps = DatePickerProps & {
	setShow: Dispatch<SetStateAction<boolean>>;
};

export const YearCalendar = (props: CalendarProps) => {
	const { date, setDate, setShow } = props;
	const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(date);

	const calendar: dayjs.Dayjs[] = [];
	/* get years from 1970 to 2070 */
	for (let i = 1970; i < 2070; i++) {
		calendar.push(dayjs(`${i}`));
	}

	/* cluster years into 12 */
	const clusters: dayjs.Dayjs[][] = useMemo(() => {
		return cluster(calendar, 12);
	}, []);

	const currentClusterIndex = clusters.findIndex((c) => {
		return c.some((d) => {
			return d.year() === calendarDate.year();
		});
	});

	const [page, setPage] = useState(currentClusterIndex);

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
						setPage((page) => {
							if (page === 0) {
								return page;
							} else {
								return page - 1;
							}
						});
					}}
				>
					<ChevronLeft size={16} />
				</button>
				{calendarDate.format("YYYY")}
				<button
					onClick={(e) => {
						e.preventDefault();
						setPage((page) => {
							if (page === clusters.length - 1) {
								return page;
							} else {
								return page + 1;
							}
						});
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
				{clusters[page].map((y, i) => {
					return (
						<Button
							key={i}
							isSelected={y.isSame(calendarDate, "year")}
							onClick={() => {
								setDate(y);
								setShow(false);
							}}
						>
							{y.year()}
						</Button>
					);
				})}
			</div>
		</div>
	);
};
