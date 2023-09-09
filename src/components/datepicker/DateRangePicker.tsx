import {
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import dayjs from "dayjs";
import { Calendar, ChevronLeftOutline, ChevronRightOutline } from "../icons";
import classNames from "classnames";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";

type DateRangePickerProps = {
	onChange?: (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => void;
};

type ContextType = {
	now: dayjs.Dayjs;
	selectedStartDate: dayjs.Dayjs;
	setSelectedStartDate: Dispatch<SetStateAction<dayjs.Dayjs>> | (() => void);
	isStartDatePickerVisible: boolean;
	setIsStartDatePickerVisible:
		| Dispatch<SetStateAction<boolean>>
		| (() => void);
	selectedEndDate: dayjs.Dayjs;
	setSelectedEndDate: Dispatch<SetStateAction<dayjs.Dayjs>> | (() => void);
	isEndDatePickerVisible: boolean;
	setIsEndDatePickerVisible: Dispatch<SetStateAction<boolean>> | (() => void);
	isEndDateBeforeStart: boolean;
	setIsEndDateBeforeStart: Dispatch<SetStateAction<boolean>> | (() => void);
};

const DateRangeContext = createContext<ContextType>({
	now: dayjs(),
	selectedStartDate: dayjs().startOf("month"),
	setSelectedStartDate: () => null,
	isStartDatePickerVisible: false,
	setIsStartDatePickerVisible: () => null,
	selectedEndDate: dayjs().endOf("month"),
	setSelectedEndDate: () => null,
	isEndDatePickerVisible: false,
	setIsEndDatePickerVisible: () => null,
	isEndDateBeforeStart: false,
	setIsEndDateBeforeStart: () => null,
});

export const DateRangePicker = (props: DateRangePickerProps) => {
	const { onChange } = props;
	const now = dayjs();
	const [selectedStartDate, setSelectedStartDate] = useState<dayjs.Dayjs>(
		now.startOf("month")
	);
	const [isStartDatePickerVisible, setIsStartDatePickerVisible] =
		useState<boolean>(false);
	const [selectedEndDate, setSelectedEndDate] = useState<dayjs.Dayjs>(
		now.endOf("month")
	);
	const [isEndDatePickerVisible, setIsEndDatePickerVisible] =
		useState<boolean>(false);
	const [isEndDateBeforeStart, setIsEndDateBeforeStart] =
		useState<boolean>(false);
	const errorInputAnimationControl = useAnimationControls();

	useEffect(() => {
		if (isEndDateBeforeStart) {
			errorInputAnimationControl.start({
				color: ["#ef4444", "#ef4444", "#ef4444"],
				borderColor: ["#ef4444", "#ef4444", "#ef4444"],
				x: [-3, 3, 0],
				transition: {
					ease: "easeInOut",
					duration: 0.1,
					repeat: 2,
				},
			});
		} else {
			errorInputAnimationControl.start({
				color: "#687280",
				borderColor: "#687280",
				transition: {
					ease: "easeInOut",
					duration: 0.2,
				},
			});
		}
	}, [isEndDateBeforeStart]);

	useEffect(() => {
		if (onChange) {
			onChange(selectedStartDate, selectedEndDate);
		}
	}, [selectedStartDate, selectedEndDate]);

	return (
		<DateRangeContext.Provider
			value={{
				now,
				selectedStartDate,
				setSelectedStartDate,
				isStartDatePickerVisible,
				setIsStartDatePickerVisible,
				selectedEndDate,
				setSelectedEndDate,
				isEndDatePickerVisible,
				setIsEndDatePickerVisible,
				isEndDateBeforeStart,
				setIsEndDateBeforeStart,
			}}
		>
			<div className="relative">
				<div className="flex gap-3">
					<fieldset
						className="start-date-picker-input
						flex justify-center items-center gap-4
						w-fit px-4
						text-gray-500
						border-2 border-solid border-gray-500 rounded-lg
						cursor-pointer"
						onClick={() => {
							if (!isStartDatePickerVisible) {
								setIsStartDatePickerVisible(true);
							}
						}}
					>
						<legend>Start</legend>
						{selectedStartDate.format("YYYY-MM-DD")}
						<Calendar size={"36"} />
					</fieldset>
					<motion.fieldset
						className={`end-date-picker-input
						flex justify-center items-center gap-4
						border-2 border-solid rounded-lg
						w-fit px-4
						cursor-pointer`}
						initial={{
							color: "#687280",
							borderColor: "#687280",
						}}
						animate={errorInputAnimationControl}
						onClick={() => {
							if (!isEndDatePickerVisible) {
								setIsEndDatePickerVisible(true);
							}
						}}
					>
						<legend>End</legend>
						{selectedEndDate.format("YYYY-MM-DD")}
						<Calendar size={"36"} />
					</motion.fieldset>
				</div>
				{isStartDatePickerVisible && (
					<DateRangePickerCore mode="start" />
				)}
				{isEndDatePickerVisible && <DateRangePickerCore mode="end" />}
			</div>
		</DateRangeContext.Provider>
	);
};

type DatePickerCoreProps = {
	mode: "start" | "end";
};

const DateRangePickerCore = (props: DatePickerCoreProps) => {
	const { mode } = props;
	const context = useContext(DateRangeContext);
	const {
		now,
		selectedStartDate,
		setSelectedStartDate,
		isStartDatePickerVisible,
		setIsStartDatePickerVisible,
		selectedEndDate,
		setSelectedEndDate,
		isEndDatePickerVisible,
		setIsEndDatePickerVisible,
		isEndDateBeforeStart,
		setIsEndDateBeforeStart,
	} = context;
	const [shownDate, setShownDate] = useState<dayjs.Dayjs>(now);
	const [isYearsVisible, setIsYearsVisible] = useState<boolean>(false);
	const [isMonthsVisible, setIsMonthsVisible] = useState<boolean>(false);
	const [isDatesVisible, setIsDatesVisible] = useState<boolean>(true);
	const [show, setShow] = useState<"Year" | "Month" | "Date">("Date");
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
		mode === "start"
			? setShownDate(selectedStartDate)
			: setShownDate(selectedEndDate);
		if (selectedEndDate.isBefore(selectedStartDate)) {
			setIsEndDateBeforeStart(true);
		} else {
			setIsEndDateBeforeStart(false);
		}
	}, [selectedStartDate, selectedEndDate]);

	useEffect(() => {
		if (isYearsVisible) {
			setIsMonthsVisible(false);
			setIsDatesVisible(false);
			setShow("Year");
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
			setShow("Month");
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
			setShow("Date");
		}
	}, [isDatesVisible]);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (
				picker.current &&
				!picker.current.contains(event.target) &&
				!event.target.classList.contains(
					mode === "start"
						? "start-date-picker-input"
						: "end-date-picker-input"
				)
			) {
				mode === "start"
					? setIsStartDatePickerVisible(false)
					: setIsEndDatePickerVisible(false);
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
			className={`absolute top-20 ${mode === "end" && " left-44"}
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
						className="flex flex-col gap-3"
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
										mode={mode}
										selectedDate={
											mode === "start"
												? selectedStartDate
												: selectedEndDate
										}
										shownDate={shownDate}
										setSelectedDate={
											mode === "start"
												? setSelectedStartDate
												: setSelectedEndDate
										}
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
								mode === "start"
									? setSelectedStartDate(
											dayjs().startOf("date")
									  )
									: setSelectedEndDate(dayjs().endOf("date"));
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
								let selectedYear;
								if (mode === "start") {
									selectedYear = selectedStartDate.year();
								} else {
									selectedYear = selectedEndDate.year();
								}
								if (year === selectedYear) {
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
											mode === "start"
												? setSelectedStartDate(
														selectedStartDate.year(
															year
														)
												  )
												: setSelectedEndDate(
														selectedEndDate.year(
															year
														)
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
								let selectedMonth;
								if (mode === "start") {
									selectedMonth = selectedStartDate.month();
								} else {
									selectedMonth = selectedEndDate.month();
								}
								if (month === selectedMonth) {
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
											mode === "start"
												? setSelectedStartDate(
														selectedStartDate.month(
															month
														)
												  )
												: setSelectedEndDate(
														selectedEndDate.month(
															month
														)
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
	mode?: "start" | "end";
	now?: dayjs.Dayjs;
	selectedDate?: dayjs.Dayjs;
	shownDate?: dayjs.Dayjs;
	setSelectedDate?: (date: dayjs.Dayjs) => any;
};

const Cell = (props: CellProps) => {
	const { children, now, mode, selectedDate, shownDate, setSelectedDate } =
		props;
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
					dark:text-gray-200 dark:bg-green-600
				`);
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
					if (mode && setSelectedDate) {
						let date;
						if (mode === "start") {
							date = dayjs(shownDate?.date(children + 1)).startOf(
								"date"
							);
						} else {
							date = dayjs(shownDate?.date(children + 1)).endOf(
								"date"
							);
						}
						setSelectedDate(date);
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
