import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import classNames from "classnames";
import { Calendar, ChevronLeftOutline, ChevronRightOutline } from "..";
import { AnimatePresence, motion } from "framer-motion";
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

type DatePickerProps = {
	onChange?: (date: dayjs.Dayjs) => void;
};

export const DatePicker = (props: DatePickerProps) => {
	const { onChange } = props;
	const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
	const now = dayjs();
	const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(now);

	useEffect(() => {
		if (onChange) {
			onChange(selectedDate);
		}
	}, [selectedDate]);

	return (
		<div className="relative">
			<div
				className="date-picker-input
				flex justify-center items-center gap-4
				w-fit px-4 py-1
				text-gray-500
				border-2 border-solid border-gray-500 rounded-lg
				cursor-pointer"
				onClick={() => {
					if (!isPickerVisible) {
						setIsPickerVisible(true);
					}
				}}
			>
				{selectedDate.format("YYYY-MM-DD")}
				<Calendar size={"36"} />
			</div>
			{isPickerVisible && (
				<DatePickerCore
					now={now}
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
					setIsPickerVisible={setIsPickerVisible}
				></DatePickerCore>
			)}
		</div>
	);
};

type DatePickerCoreProps = {
	now: dayjs.Dayjs;
	selectedDate: dayjs.Dayjs;
	setSelectedDate: Dispatch<SetStateAction<dayjs.Dayjs>>;
	setIsPickerVisible: Dispatch<SetStateAction<boolean>>;
};

const DatePickerCore = (props: DatePickerCoreProps) => {
	const { now, selectedDate, setSelectedDate, setIsPickerVisible } = props;
	const [shownDate, setShownDate] = useState<dayjs.Dayjs>(now);
	const [isYearsVisible, setIsYearsVisible] = useState<boolean>(false);
	const [isMonthsVisible, setIsMonthsVisible] = useState<boolean>(false);
	const [isDatesVisible, setIsDatesVisible] = useState<boolean>(true);
	const picker = useRef<any>(null);

	const selectableYears = Array.from(Array(100), (_, i) => 1990 + i);
	const selectableMonths = Array.from(Array(12), (_, i) => i);
	const weekdays = Array.from(Array(7), (_, i) => i);
	const offsetDaysOfMonth = getOffsetDaysOfMonth(shownDate);
	const daysInMonth = getDaysInMonth(shownDate);

	function getOffsetDaysOfMonth(date: dayjs.Dayjs): number[] {
		const offsetDays = Array.from(
			Array(date.date(1).get("day")),
			(_, i) => i
		);
		return offsetDays;
	}

	function getDaysInMonth(date: dayjs.Dayjs): number[] {
		const daysInMonth = Array.from(Array(date.daysInMonth()), (_, i) => i);
		return daysInMonth;
	}

	useEffect(() => {
		setShownDate(selectedDate);
	}, [selectedDate]);

	useEffect(() => {
		if (isYearsVisible) {
			setIsMonthsVisible(false);
			setIsDatesVisible(false);
		} else {
			if (!isMonthsVisible) {
				setIsDatesVisible(true);
			}
		}
	}, [isYearsVisible]);

	useEffect(() => {
		if (isMonthsVisible) {
			setIsYearsVisible(false);
			setIsDatesVisible(false);
		} else {
			if (!isYearsVisible) {
				setIsDatesVisible(true);
			}
		}
	}, [isMonthsVisible]);

	useEffect(() => {
		if (isDatesVisible) {
			setIsYearsVisible(false);
			setIsMonthsVisible(false);
		}
	}, [isDatesVisible]);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (
				picker.current &&
				!picker.current.contains(event.target) &&
				!event.target.classList.contains("date-picker-input")
			) {
				setIsPickerVisible(false);
			}
		}
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [picker]);

	return (
		<div
			ref={picker}
			className={`absolute top-16
			flex flex-col gap-3 max-h-[436px] min-w-[358px]
			bg-gray-50 dark:bg-gray-800
			border-gray-400 dark:border-gray-600
			border-2 rounded-xl p-3 shadow-lg
			z-10`}
		>
			<div
				className="grid gap-3 grid-cols-7 min-h-[36px]
				text-gray-700 dark:text-gray-300"
			>
				<div
					className="flex justify-center items-center
					hover:text-green-500
					transition-all duration-200
					cursor-pointer"
					onClick={() => {
						setIsMonthsVisible(!isMonthsVisible);
					}}
				>
					{shownDate.format("MMM")}
				</div>
				<div
					className="flex justify-center items-center
					hover:text-green-500
					transition-all duration-200
					cursor-pointer"
					onClick={() => {
						setIsYearsVisible(!isYearsVisible);
					}}
				>
					{shownDate.format("YYYY")}
				</div>
				<div className="col-span-3"></div>
				{isDatesVisible ? (
					<div
						className="flex justify-center items-center
						hover:text-green-500
						transition-all duration-200
						cursor-pointer"
						onClick={() => {
							setShownDate(shownDate.subtract(1, "month"));
						}}
					>
						<ChevronLeftOutline size={"36"} />
					</div>
				) : (
					<div></div>
				)}
				{isDatesVisible ? (
					<div
						className="flex justify-center items-center
						hover:text-green-500
						transition-all duration-200
						cursor-pointer"
						onClick={() => {
							setShownDate(shownDate.add(1, "month"));
						}}
					>
						<ChevronRightOutline size={"36"} />
					</div>
				) : (
					<div></div>
				)}
			</div>
			<AnimatePresence mode="wait">
				{isDatesVisible ? (
					<motion.div
						className="flex flex-col gap-3 w-full"
						key={"dates"}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
					>
						<div
							className="grid gap-3 grid-cols-7
							text-gray-700 dark:text-gray-300"
						>
							{weekdays.map((weekday) => {
								return (
									<div
										className="flex justify-center items-center"
										key={`weekday-${weekday}`}
									>
										{dayjs().day(weekday).format("ddd")}
									</div>
								);
							})}
							{offsetDaysOfMonth.map((offsetDay) => {
								return (
									<Cell key={`offsetDay-${offsetDay}`}></Cell>
								);
							})}
							{daysInMonth.map((dateInMonth) => {
								return (
									<Cell
										key={`dateInMonth-${dateInMonth}`}
										now={now}
										selectedDate={selectedDate}
										shownDate={shownDate}
										setSelectedDate={setSelectedDate}
									>
										{dateInMonth}
									</Cell>
								);
							})}
						</div>
						<div
							className="flex justify-center items-start
							cursor-pointer"
							onClick={() => {
								setSelectedDate(dayjs());
							}}
						>
							<div
								className="px-2 py-1
								text-gray-200 hover:text-gray-100
								bg-green-500 hover:bg-green-600
								rounded-2xl
								transition-all duration-200"
							>
								Today
							</div>
						</div>
					</motion.div>
				) : isYearsVisible ? (
					<motion.div
						className="flex flex-col gap-3
						max-h-72
						overflow-y-scroll
						scrollbar"
						key={"years"}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
					>
						<div
							className="grid gap-3 grid-cols-4
							text-gray-700 dark:text-gray-300"
						>
							{selectableYears.map((year) => {
								let textClass;
								if (year === selectedDate.year()) {
									textClass = classNames(`
									text-gray-50 bg-green-500
									dark:text-gray-200 dark:bg-green-600
								`);
								} else {
									textClass = classNames(`
									text-gray-500 hover:text-gray-600 hover:bg-green-200
									dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-green-800
								`);
								}
								return (
									<div
										key={`year-${year}`}
										className={`flex justify-center items-center mx-2
									${textClass}
									rounded-3xl
									transition-all duration-200
									cursor-pointer`}
										onClick={() => {
											setSelectedDate(
												selectedDate.year(year)
											);
											setIsDatesVisible(true);
										}}
									>
										{year}
									</div>
								);
							})}
						</div>
					</motion.div>
				) : isMonthsVisible ? (
					<motion.div
						className="flex flex-col gap-3
						max-h-72
						overflow-y-auto
						scrollbar"
						key={"months"}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
					>
						<div
							className="grid gap-3 grid-cols-3
							text-gray-700 dark:text-gray-300"
						>
							{selectableMonths.map((month) => {
								let textClass;
								if (month === selectedDate.month()) {
									textClass = classNames(`
									text-gray-50 bg-green-500
									dark:text-gray-200 dark:bg-green-600
								`);
								} else {
									textClass = classNames(`
									text-gray-500 hover:text-gray-600 hover:bg-green-200
									dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-green-800
								`);
								}
								return (
									<div
										key={`month-${month}`}
										className={`flex justify-center items-center min-h-[36px]
										${textClass}
										rounded-3xl
										transition-all duration-200
										cursor-pointer`}
										onClick={() => {
											setSelectedDate(
												selectedDate.month(month)
											);
											setIsDatesVisible(true);
										}}
									>
										{dayjs().month(month).format("MMM")}
									</div>
								);
							})}
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
};

type CellProps = {
	key: string;
	children?: number;
	now?: dayjs.Dayjs;
	selectedDate?: dayjs.Dayjs;
	shownDate?: dayjs.Dayjs;
	setSelectedDate?: (date: dayjs.Dayjs) => any;
};

const Cell = (props: CellProps) => {
	const { children, now, selectedDate, shownDate, setSelectedDate } = props;
	if (children !== null && children !== undefined) {
		const isToday =
			shownDate?.year() === now?.year() &&
			shownDate?.month() === now?.month() &&
			children + 1 === now?.date();
		const isSelectedDate =
			shownDate?.year() === selectedDate?.year() &&
			shownDate?.month() === selectedDate?.month() &&
			children + 1 === selectedDate?.date();
		let textClass;
		if (isToday || isSelectedDate) {
			if (isToday && isSelectedDate) {
				/* Today is selected date */
				textClass = classNames(`
					text-gray-50 bg-green-500
					dark:text-gray-200 dark:bg-green-600`);
			} else if (isToday) {
				/* Today */
				textClass = classNames(
					`text-gray-500 border-2 border-green-500 hover:text-gray-600 hover:border-0 hover:bg-green-200
					dark:text-gray-400 dark:hover:bg-green-800`
				);
			} else {
				/* Selected date */
				textClass = classNames(`
					text-gray-50 bg-green-500
					dark:text-gray-200 dark:bg-green-600
				`);
			}
		} else {
			textClass = classNames(
				`text-gray-500 hover:text-gray-600 hover:bg-green-200
				dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-green-800`
			);
		}
		return (
			<div
				className={`flex justify-center items-center min-w-[36px] min-h-[36px]
				${textClass}
				rounded-3xl 
				cursor-pointer
				transition-all duration-200`}
				onClick={() => {
					if (setSelectedDate) {
						setSelectedDate(dayjs(shownDate?.date(children + 1)));
					}
				}}
			>
				{children + 1}
			</div>
		);
	} else {
		return <div></div>;
	}
};
