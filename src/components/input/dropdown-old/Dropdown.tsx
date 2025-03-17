import { Dispatch, SetStateAction } from "react";
import { StringDropdown } from "./string-like/StringDropdown";
import { ObjectDropdown } from "./object-like/ObjectDropdown";
import { StringKeys } from "./types";

export type ObjectLike<T> = {
	kind: "object";
	/**
	 * both "regular" and "search" have dropdown
	 * "regular" mode is for selecting an option
	 * "search" mode is for searching an option
	 */
	mode: "regular" | "search";
	selected: T | undefined;
	setSelected: Dispatch<SetStateAction<T | undefined>>;
	/* 'hover' is typically used to preview the content */
	setHover?: Dispatch<SetStateAction<T | undefined>>;
	/* all options */
	options: T[];
	placeholder: string;
	/**
	 * label
	 * format: primary (secondary)
	 */
	label: {
		primaryKey: StringKeys<T>;
		secondaryKey?: StringKeys<T>;
	};
	/* sort by, property name */
	sortBy: StringKeys<T>;
};
/**
 * here T could be string, enum or union string type
 */
export type StringLike<T> = {
	kind: "string";
	mode: "regular" | "search";
	selected: T | undefined;
	setSelected: Dispatch<SetStateAction<T | undefined>>;
	setHover?: Dispatch<SetStateAction<T | undefined>>;
	options: T[];
	placeholder: string;
};
type DropdownInputProps<T> = StringLike<T> | ObjectLike<T>;

export const Dropdown = <T,>(props: DropdownInputProps<T>) => {
	function isStringLike(
		props: DropdownInputProps<T>
	): props is StringLike<T> {
		return props.kind === "string";
	}
	if (isStringLike(props)) {
		const { mode, selected, setSelected, setHover, options, placeholder } =
			props;
		return (
			<StringDropdown
				kind="string"
				mode={mode}
				selected={selected}
				setSelected={setSelected}
				setHover={setHover}
				options={options}
				placeholder={placeholder}
			/>
		);
	} else {
		const {
			mode,
			selected,
			setSelected,
			setHover,
			options,
			label: { primaryKey, secondaryKey },
			placeholder,
			sortBy,
		} = props;
		return (
			<ObjectDropdown
				kind="object"
				mode={mode}
				selected={selected}
				setSelected={setSelected}
				setHover={setHover}
				options={options}
				label={{ primaryKey, secondaryKey }}
				placeholder={placeholder}
				sortBy={sortBy}
			/>
		);
	}
};
