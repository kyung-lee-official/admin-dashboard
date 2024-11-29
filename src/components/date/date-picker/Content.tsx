"use client";

import dayjs from "dayjs";
import { DatePicker } from "./DatePicker";
import { useState } from "react";

export const Content = () => {
	const [date, setDate] = useState<dayjs.Dayjs>(dayjs());

	return (
		<div>
			<h2>date picker</h2>
			<DatePicker date={date} setDate={setDate} />
		</div>
	);
};
