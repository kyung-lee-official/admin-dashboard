import { SearchOutlineIcon } from "@/components/icons/Icons";
import {
	useState,
	useRef,
	useCallback,
	useEffect,
	Dispatch,
	SetStateAction,
} from "react";
import { sortByProp, StringKeys } from "@/utils/data/data";

export const DropdownInput = <T, K extends StringKeys<T>>(props: {
	/**
	 * both "regular" and "search" have dropdown
	 * "regular" mode is for selecting an option
	 * "search" mode is for searching an option
	 */
	mode: "regular" | "search";
	selected: T | undefined;
	setSelected:
		| Dispatch<SetStateAction<T>>
		| Dispatch<SetStateAction<T | undefined>>
		| Dispatch<SetStateAction<undefined>>;
	/* 'hover' is typically used to preview the content */
	hover?: T | undefined;
	setHover?: Dispatch<SetStateAction<T | undefined>>;
	/* all options */
	options: T[];
	placeholder: string;
	/**
	 * label
	 * format: primary (secondary)
	 */
	labelProp: {
		primary: K;
		secondary?: K;
	};
	/* sort by, property name */
	sortBy: K;
}) => {
	const [show, setShow] = useState<boolean>(false);

	const entryRef = useRef<HTMLInputElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleClick = useCallback((e: any) => {
		if (entryRef.current) {
			if (
				e.target === entryRef.current ||
				entryRef.current.contains(e.target)
			) {
				/* entry clicked */
				setShow(true);
			} else {
				if (menuRef.current) {
					/* menu clicked */
					if (
						e.target === menuRef.current ||
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

	const {
		mode,
		selected,
		setSelected,
		hover,
		setHover,
		options,
		labelProp: { primary, secondary },
		placeholder,
		sortBy,
	} = props;

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [filteredOptions, setFilteredOptions] = useState<T[]>(options);
	useEffect(() => {
		if (searchTerm) {
			const filtered = options.filter((item) => {
				return (
					String(item[primary])
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					(secondary &&
						String(item[secondary])
							.toLowerCase()
							.includes(searchTerm.toLowerCase()))
				);
			});
			setFilteredOptions(filtered);
		} else {
			setFilteredOptions(options);
		}
	}, [searchTerm, options]);

	let label = "";
	if (selected) {
		label = secondary
			? `${selected[primary]} (${selected[secondary]})`
			: `${selected[primary]}`;
	}

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
				placeholder={placeholder}
				readOnly={mode !== "search"}
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
				{mode === "search" && <SearchOutlineIcon size={20} />}
			</div>
			{show && filteredOptions && (
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
					{sortByProp(
						mode === "search" ? filteredOptions : options,
						sortBy
					).map((item: any, i: number) => {
						const title = secondary
							? `${item[primary]} (${item[secondary]})`
							: `${item[primary]}`;
						return (
							<button
								key={item.id}
								title={title}
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
									setSearchTerm(title);
									setShow(false);
								}}
							>
								{title}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};
