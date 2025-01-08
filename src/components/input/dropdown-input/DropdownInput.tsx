import { Dispatch, SetStateAction } from "react";
import { StringKeys } from "@/utils/data/data";
import { StringDropdown } from "./StringDropdown";
import { ObjectDropdown } from "./ObjectDropdown";

export type DropdownObject<T> = {
	kind: "object";
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
export type DropdownString<T> = {
	kind: "string";
	mode: "regular" | "search";
	selected: T | undefined;
	setSelected:
		| Dispatch<SetStateAction<T>>
		| Dispatch<SetStateAction<T | undefined>>
		| Dispatch<SetStateAction<undefined>>;
	hover?: T | undefined;
	setHover?: Dispatch<SetStateAction<T | undefined>>;
	options: T[];
	placeholder: string;
};
type DropdownInputProps<T> = DropdownString<T> | DropdownObject<T>;

export const DropdownInput = <T,>(props: DropdownInputProps<T>) => {
	function isStringLike(
		props: DropdownInputProps<T>
	): props is DropdownString<T> {
		return props.kind === "string";
	}
	if (isStringLike(props)) {
		const {
			mode,
			selected,
			setSelected,
			hover,
			setHover,
			options,
			placeholder,
		} = props;
		return (
			<StringDropdown
				kind="string"
				mode={mode}
				selected={selected}
				setSelected={setSelected}
				hover={hover}
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
			hover,
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
				hover={hover}
				setHover={setHover}
				options={options}
				label={{ primaryKey, secondaryKey }}
				placeholder={placeholder}
				sortBy={sortBy}
			/>
		);
	}
};
