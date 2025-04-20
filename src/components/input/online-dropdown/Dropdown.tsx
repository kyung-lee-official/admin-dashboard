import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";

type DropdownProps<T> = {
	placeholder?: string;
	selected: T | T[] | null /* support single or multiple selected items */;
	setSelected: Dispatch<SetStateAction<T | T[] | null>>;
	fetchOptions: (
		query: string
	) => Promise<T[]> /* function to fetch options */;
	labelKey: keyof T /* key to use for the display label */;
	multiple?: boolean /* enable multi-selection */;
	renderOption?: (
		option: T
	) => React.ReactNode /* custom render function for options */;
};

export const Dropdown = <T extends Record<string, any>>({
	placeholder = "Select an option",
	selected,
	setSelected,
	fetchOptions,
	labelKey,
	multiple = false,
	renderOption,
}: DropdownProps<T>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [options, setOptions] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	/* fetch options using the provided function */
	useEffect(() => {
		if (!isOpen || searchTerm === "") {
			setOptions([]);
			return;
		}

		const fetchData = async () => {
			setLoading(true);
			try {
				const data = await fetchOptions(searchTerm);
				setOptions(data);
			} catch (error) {
				console.error("Error fetching options:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [searchTerm, isOpen, fetchOptions]);

	/* Close dropdown when clicking outside */
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (option: T) => {
		if (multiple) {
			/* handle multi-selection */
			const selectedArray = Array.isArray(selected) ? selected : [];
			if (selectedArray.some((item) => item.id === option.id)) {
				/* unselect the option if already selected */
				setSelected(
					selectedArray.filter((item) => item.id !== option.id)
				);
			} else {
				/* add the option to the selected list */
				setSelected([...selectedArray, option]);
			}
		} else {
			/* handle single selection */
			setSelected(option);
			setIsOpen(false);
		}
	};

	const isSelected = (option: T) => {
		if (!multiple) return false;
		const selectedArray = Array.isArray(selected) ? selected : [];
		return selectedArray.some((item) => item.id === option.id);
	};

	return (
		<div
			ref={dropdownRef}
			className="relative w-full max-w-xs
			text-sm"
		>
			<div
				className="flex items-center px-2 py-1
				bg-neutral-800
				border border-neutral-700 rounded-md cursor-pointer"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="text-white/60">
					{multiple
						? placeholder
						: selected
						? !Array.isArray(selected) && selected[labelKey]
						: placeholder}
				</span>
			</div>

			{isOpen && (
				<div
					className="absolute z-10 w-full mt-1 
					bg-neutral-800 
					border border-neutral-700 rounded-md overflow-auto"
				>
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search..."
						className="w-full p-2
						text-neutral-400
						border-neutral-700 border-b outline-none"
					/>
					{loading ? (
						<div className="p-2 text-center text-white/60">
							Loading...
						</div>
					) : options.length > 0 ? (
						options.map((option) => (
							<div
								key={option.id}
								className="flex justify-between items-center px-2 py-1
								text-neutral-400
								hover:bg-neutral-700
								cursor-pointer"
								onClick={() => handleSelect(option)}
							>
								{renderOption ? (
									renderOption(option)
								) : (
									<span>{option[labelKey]}</span>
								)}
								{isSelected(option) && (
									<span className="text-green-500">✔️</span>
								)}
							</div>
						))
					) : (
						<div className="p-2 text-center text-white/60">
							No options found
						</div>
					)}
				</div>
			)}
		</div>
	);
};
