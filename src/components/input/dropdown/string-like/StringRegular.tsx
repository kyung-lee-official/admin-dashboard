import { Dispatch, RefObject, SetStateAction } from "react";

export const StringRegular = <T,>(props: {
	entryRef: RefObject<HTMLInputElement | null>;
	menuRef: RefObject<HTMLDivElement | null>;
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
	setSelected: Dispatch<SetStateAction<T | undefined>>;
	label: string;
	setHover?: Dispatch<SetStateAction<T | undefined>>;
	options: T[];
	placeholder: string;
	setSearchTerm: Dispatch<SetStateAction<string>>;
}) => {
	const {
		entryRef,
		menuRef,
		show,
		setShow,
		setSelected,
		label,
		setHover,
		options,
		placeholder,
		setSearchTerm,
	} = props;
	return (
		<div
			className="relative flex items-center
			text-white/50"
		>
			<input
				ref={entryRef}
				type="text"
				value={label}
				title={label}
				placeholder={placeholder || ""}
				className="px-2 py-1
				text-sm
				bg-white/10
				border-[1px] border-y-[1px] border-white/10
				rounded-md outline-none whitespace-nowrap text-ellipsis"
				onChange={(e) => {
					setSearchTerm(e.target.value);
				}}
			/>
			{show && !!options.length && (
				<div
					ref={menuRef}
					className="absolute top-10 left-0 w-52
					flex flex-col p-1
					text-sm
					bg-neutral-800
					rounded-md shadow-lg border-[1px] border-white/10 border-t-white/15
					z-20"
					onMouseLeave={() => {
						if (setHover) {
							setHover(undefined);
						}
					}}
				>
					{options
						.sort((a, b) => {
							return (a as string).localeCompare(b as string);
						})
						.map((item: T, i: number) => {
							const title = item;
							return (
								<button
									key={i}
									title={title as string}
									className="p-2
									text-left
									overflow-hidden whitespace-nowrap text-ellipsis
									hover:bg-white/10
									rounded"
									onMouseEnter={() => {
										if (setHover) {
											setHover(item);
										}
									}}
									onClick={() => {
										setSelected(item);
										setSearchTerm(title as string);
										setShow(false);
									}}
								>
									{title as string}
								</button>
							);
						})}
				</div>
			)}
		</div>
	);
};
