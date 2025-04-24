import { MouseEventHandler, ReactNode, useRef, useState } from "react";
import { MoreIcon } from "@/components/icons/Icons";

export const TitleMoreMenuButton = (props: {
	children: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
	const { children, onClick } = props;
	return (
		<button
			className={`flex items-center w-full px-2 py-1.5 gap-2
			hover:bg-white/5
			rounded cursor-pointer whitespace-nowrap`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export const TitleMoreMenu = (props: { items: (string | ReactNode)[] }) => {
	const { items } = props;

	const [show, setShow] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	return (
		<div
			className="relative w-fit
			text-white/50"
			onClick={(e) => {
				/* prevent clicks from propagating to parent elements */
				e.stopPropagation();
			}}
		>
			<button
				className="flex justify-center items-center w-7 h-7
				hover:bg-white/10 rounded-md cursor-pointer"
				onClick={(e) => {
					e.preventDefault();
					setShow((prev) => !prev);
				}}
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
					/* prevent clicks inside the menu from closing it */
					onClick={(e) => e.stopPropagation()}
				>
					{items.map((item, i) => {
						return (
							<div key={i} className="fiex items-center w-full">
								{item}
							</div>
						);
					})}
				</div>
			)}
			{/* Close the menu when clicking outside */}
			{show && (
				<div
					className="fixed inset-0 z-0"
					onClick={() => setShow(false)}
				></div>
			)}
		</div>
	);
};
