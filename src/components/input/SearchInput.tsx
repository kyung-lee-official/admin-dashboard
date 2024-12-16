import { SearchOutlineIcon } from "@/components/icons/Icons";
import {
	useState,
	useRef,
	useCallback,
	useEffect,
	Dispatch,
	SetStateAction,
} from "react";
import { sortByProp } from "@/utils/data/data";

/* get all string keys of an object */
type StringKeys<T> = {
	[K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export const SearchInput = <T, K extends StringKeys<T>>(props: {
	selected: T | undefined;
	setSelected: Dispatch<SetStateAction<T | undefined>>;
	/* all options */
	options: T[];
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
				setShow((state) => {
					return !state;
				});
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
		selected,
		setSelected,
		options,
		labelProp: { primary, secondary },
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
		}
	}, [searchTerm]);

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
				placeholder="Select a member"
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
			{show && filteredOptions && (
				<div
					ref={menuRef}
					className="absolute top-10
					flex flex-col
					bg-neutral-800
					rounded-md shadow-lg border-[1px] border-white/10 border-t-white/15"
				>
					{sortByProp(filteredOptions, sortBy).map(
						(item: any, i: number) => {
							return (
								<button
									key={item.id}
									className="p-2 text-nowrap"
									onClick={() => {
										setSelected(item);
										setSearchTerm(
											`${item[primary]}${
												secondary &&
												` (${item[secondary]})`
											}`
										);
										setShow(false);
									}}
								>
									{item[primary]}{" "}
									{secondary && `(${item[secondary]})`}
								</button>
							);
						}
					)}
				</div>
			)}
		</div>
	);
};
