"use client";

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";

type BaseProps<T> = {
	mode?: "regular" | "search";
	placeholder?: string;
	options: T[];
	selected: T | T[] | null;
	setSelected: Dispatch<SetStateAction<T | T[] | null>>;
	setHover?: Dispatch<SetStateAction<T | T[] | null>>;
	multiple?: boolean;
};

type StringProps<T extends string> = BaseProps<T> & {
	kind: "string";
};

type ObjectProps<T extends object> = BaseProps<T> & {
	kind: "object";
	sortBy: keyof T;
	label: {
		primaryKey: keyof T;
		secondaryKey?: keyof T;
	};
};

type DropdownProps<T> = [T] extends [string]
	? StringProps<T>
	: T extends object
	? ObjectProps<T>
	: any;
type RestProps<T> = T extends object
	? {
			sortBy: keyof T;
			label: {
				primaryKey: keyof T;
				secondaryKey?: keyof T;
			};
	  }
	: never;

export const Dropdown = <T,>(props: DropdownProps<T>) => {
	const {
		kind,
		mode = "regular",
		placeholder = "Select an option",
		options,
		selected,
		setSelected,
		setHover,
		multiple = false,
		...rest
	} = props;

	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	/* type assertions for object-specific props */
	const objectProps =
		kind === "object" ? (rest as unknown as RestProps<T>) : null;

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
			const currentSelected = Array.isArray(selected) ? selected : [];
			const index = currentSelected.findIndex((item) =>
				kind === "string"
					? item === option
					: JSON.stringify(item) === JSON.stringify(option)
			);

			if (index > -1) {
				setSelected([
					...currentSelected.slice(0, index),
					...currentSelected.slice(index + 1),
				]);
			} else {
				setSelected([...currentSelected, option]);
			}
		} else {
			setSelected(option);
			setIsOpen(false);
		}
	};

	const handleRemove = (option: T) => {
		if (multiple && Array.isArray(selected)) {
			setSelected(
				selected.filter((item) =>
					kind === "string"
						? item !== option
						: JSON.stringify(item) !== JSON.stringify(option)
				)
			);
		}
	};

	const filteredOptions = options
		.filter((option) => {
			if (mode !== "search" || !searchTerm) return true;
			if (kind === "string") {
				return (option as unknown as string)
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			}
			const primary = String(
				(option as any)[objectProps?.label.primaryKey]
			);
			const secondary = objectProps?.label.secondaryKey
				? String((option as any)[objectProps.label.secondaryKey])
				: "";
			return (
				primary.toLowerCase().includes(searchTerm.toLowerCase()) ||
				secondary.toLowerCase().includes(searchTerm.toLowerCase())
			);
		})
		.sort((a, b) => {
			if (kind === "object" && objectProps?.sortBy) {
				return String(a[objectProps.sortBy]).localeCompare(
					String(b[objectProps.sortBy])
				);
			}
			return 0;
		});

	const getDisplayValue = (option: T) => {
		if (kind === "string") return option as string;
		return String((option as any)[objectProps!.label.primaryKey]);
	};

	return (
		<div
			ref={dropdownRef}
			className="relative w-full max-w-xs
			text-sm"
		>
			<div
				className="flex items-center flex-wrap min-h-8 px-2 py-1 gap-2
				bg-neutral-800
				border-1 border-neutral-700 rounded-md cursor-pointer"
				onClick={() => setIsOpen(!isOpen)}
			>
				{multiple && Array.isArray(selected) && selected.length > 0 ? (
					selected.map((item, i) => (
						<div
							key={i}
							className="flex items-center h-fit px-1.5 py-0.5 gap-1
							text-xs
							text-white/60
							bg-neutral-700
							border-1 border-neutral-600 rounded"
						>
							<span>{getDisplayValue(item)}</span>
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleRemove(item);
								}}
								className="text-white/60 hover:text-white/80
								cursor-pointer"
							>
								×
							</button>
						</div>
					))
				) : !multiple && selected ? (
					<span className="text-white/60">{getDisplayValue(selected as T)}</span>
				) : (
					<span className="text-neutral-400">{placeholder}</span>
				)}
			</div>

			{isOpen && (
				<div
					className="absolute z-10 w-full mt-1
					text-white/60
					bg-neutral-800
					border border-neutral-700 rounded-md overflow-auto"
				>
					{mode === "search" && (
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onClick={(e) => e.stopPropagation()}
							placeholder="Search..."
							className="w-full p-2 border-b border-neutral-700 outline-none"
						/>
					)}
					{filteredOptions.map((option, i) => (
						<div
							key={i}
							className="px-2 py-1
							hover:bg-neutral-700
							cursor-pointer"
							onClick={() => handleSelect(option)}
							onMouseEnter={() => setHover && setHover(option)}
							onMouseLeave={() => setHover && setHover(null)}
						>
							{kind === "string" ? (
								<div className="truncate" title={option}>
									{option}
								</div>
							) : (
								<div
									className="flex gap-1"
									title={
										getDisplayValue(option) +
										" " +
										(objectProps!.label.secondaryKey
											? String(
													(option as any)[
														objectProps!.label
															.secondaryKey
													]
											  )
											: "")
									}
								>
									<div className="text-neutral-300">
										{String(
											(option as any)[
												objectProps!.label.primaryKey
											]
										)}
									</div>
									{objectProps!.label.secondaryKey && (
										<div className="truncate text-sm text-neutral-400">
											{String(
												(option as any)[
													objectProps!.label
														.secondaryKey
												]
											)}
										</div>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
