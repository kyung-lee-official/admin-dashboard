"use client";

import dayjs from "dayjs";
import { DateRangePicker } from "./DateRangePicker";
import { useState } from "react";

export type DateRange = {
	start: dayjs.Dayjs;
	end: dayjs.Dayjs;
};

export const Content = () => {
	const [range, setRange] = useState<DateRange>({
		start: dayjs().startOf("month"),
		end: dayjs().endOf("month"),
	});

	return (
		<div>
			<h2>date range picker</h2>
			<DateRangePicker range={range} setRange={setRange} />
		</div>
	);
};
