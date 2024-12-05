"use client";

import dayjs from "dayjs";
import { useState } from "react";
import { YearPicker } from "./YearPicker";

export const Content = () => {
	const [date, setDate] = useState<dayjs.Dayjs>(dayjs());

	return (
		<div>
			<h2>year picker</h2>
			<YearPicker date={date} setDate={setDate} />
		</div>
	);
};
