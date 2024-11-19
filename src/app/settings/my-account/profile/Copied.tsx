import { animated, useTransition } from "@react-spring/web";
import { forwardRef, useImperativeHandle, useState } from "react";

export const Copied = forwardRef(function Copied(props, ref) {
	const [items, setItems] = useState<string[]>([]);

	const trigger = () => {
		setItems(["Copied!"]);
		const timer = setTimeout(() => {
			setItems([]);
		}, 2000);
		return () => clearTimeout(timer);
	};

	useImperativeHandle(
		ref,
		() => {
			return {
				trigger,
			};
		},
		[]
	);

	const transitions = useTransition(items, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	});

	return (
		<div>
			{transitions((style, item) => {
				return (
					<animated.div className={"text-green-500"} style={style}>
						{item}
					</animated.div>
				);
			})}
		</div>
	);
});
