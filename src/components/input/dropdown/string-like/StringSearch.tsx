import { Dispatch, RefObject, SetStateAction } from "react";
import { SearchOutlineIcon } from "../Icons";

export const StringSearch = <T,>(props: {
	entryRef: RefObject<HTMLInputElement | null>;
	menuRef: RefObject<HTMLDivElement | null>;
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
	setSelected: Dispatch<SetStateAction<T | undefined>>;
	label: string;
	setHover?: Dispatch<SetStateAction<T | undefined>>;
	filteredOptions: T[];
	placeholder: string;
	searchTerm: string;
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
		filteredOptions,
		placeholder,
		searchTerm,
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
				value={searchTerm}
				title={label}
				placeholder={placeholder || ""}
				className="px-2 py-1
				text-sm
				bg-white/10
				border-solid border-l-[1px] border-y-[1px] border-white/10
				rounded-l-md outline-none whitespace-nowrap text-ellipsis"
				onChange={(e) => {
					setSearchTerm(e.target.value);
				}}
			/>
			<div
				className="flex justify-center items-center h-[30px] px-1
				bg-white/10
				border-solid border-r-[1px] border-y-[1px] border-white/10
				rounded-r-md"
			>
				<SearchOutlineIcon size={20} />
			</div>
			{show && !!filteredOptions.length && (
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
					{filteredOptions
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
