import { useEffect, useState } from "react";

export const CheckingSeeded = () => {
	const [count, setCount] = useState<number>(0);
	const [ellipsis, setEllipsis] = useState<string>("");
	useEffect(() => {
		const interval = setInterval(() => {
			setCount((count) => count + 1);
		}, 500);
		return () => clearInterval(interval);
	}, []);
	useEffect(() => {
		const dots = count % 4;
		setEllipsis(".".repeat(dots));
	}, [count]);
	return <div className="text-6xl">🌱{ellipsis}</div>;
};
