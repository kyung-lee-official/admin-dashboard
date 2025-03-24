import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { MoreIcon } from "@/components/icons/Icons";

export const TitleMoreMenu = (props: {
	items: {
		content: string | ReactNode;
		type?: "danger";
		/* hide menu after clicking on one of the items */
		hideMenuOnClick: boolean;
		icon?: ReactNode;
		onClick: Function;
	}[];
}) => {
	const { items } = props;

	const [show, setShow] = useState(false);
	const entryRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

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
				if (menuRef.current) {
					/* menu clicked */
					if (
						menuRef.current.contains(e.target) ||
						menuRef.current.contains(e.target)
					) {
						/* do nothing or hide menu, up to you */
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
			className="relative w-fit
			text-white/50"
		>
			<button
				ref={entryRef}
				className="flex justify-center items-center w-7 h-7
				hover:bg-white/10 rounded-md"
			>
				<MoreIcon size={15} />
			</button>
			{show && (
				<div
					ref={menuRef}
					className="absolute top-9 right-0
					flex flex-col min-w-52 p-1
					text-sm
					bg-neutral-800
					rounded-md shadow-md border-[1px] border-white/10 border-t-white/15
					z-10"
				>
					{items.map((item, i) => {
						return (
							<button
								key={i}
								className={`flex items-center px-2 py-1.5 gap-2
								${item.type && item.type === "danger" ? "text-red-500" : ""}
								hover:bg-white/5
								rounded cursor-pointer whitespace-nowrap`}
								onClick={() => {
									item.onClick();
									if (item.hideMenuOnClick) {
										setShow(false);
									}
								}}
							>
								{item.icon && <div>{item.icon}</div>}
								<div>{item.content}</div>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};
