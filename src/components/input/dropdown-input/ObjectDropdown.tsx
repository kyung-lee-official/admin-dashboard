import { sortByProp } from "@/utils/data/data";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchOutlineIcon } from "@/components/icons/Icons";
import { DropdownObject } from "./DropdownInput";

export const ObjectDropdown = <T,>(props: DropdownObject<T>) => {
	const {
		mode,
		selected,
		setSelected,
		hover,
		setHover,
		options,
		label: { primaryKey, secondaryKey },
		placeholder,
		sortBy,
	} = props;

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

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [filteredOptions, setFilteredOptions] = useState<T[]>(options);
	useEffect(() => {
		if (searchTerm) {
			const filtered = options.filter((item) => {
				return (
					String(item[primaryKey])
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					(secondaryKey &&
						String(item[secondaryKey])
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
		label = secondaryKey
			? `${selected[primaryKey]} (${selected[secondaryKey]})`
			: `${selected[primaryKey]}`;
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
				placeholder={placeholder || ""}
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
						const title = secondaryKey
							? `${item[primaryKey]} (${item[secondaryKey]})`
							: `${item[primaryKey]}`;
						return (
							<button
								key={i}
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
