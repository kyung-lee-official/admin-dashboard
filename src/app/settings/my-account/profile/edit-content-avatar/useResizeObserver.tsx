import { useState, useEffect, RefObject } from "react";

const useResizeObserver = (ref: RefObject<HTMLDivElement>) => {
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			setSize({
				width: entry.contentRect.width,
				height: entry.contentRect.height,
			});
		});

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [ref]);

	return size;
};

export default useResizeObserver;
