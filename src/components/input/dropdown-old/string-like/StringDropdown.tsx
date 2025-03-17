import { useCallback, useEffect, useRef, useState } from "react";
import { StringRegular } from "./StringRegular";
import { StringSearch } from "./StringSearch";
import { StringLike } from "../Dropdown";

export const StringDropdown = <T,>(props: StringLike<T>) => {
	const { mode, selected, setSelected, setHover, options, placeholder } =
		props;
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
				return (item as string)
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			});
			setFilteredOptions(filtered);
		} else {
			setFilteredOptions(options);
		}
	}, [searchTerm, options]);

	let label = "";
	if (selected) {
		label = selected as string;
	}

	switch (mode) {
		case "regular":
			return (
				<StringRegular<T>
					entryRef={entryRef}
					menuRef={menuRef}
					show={show}
					setShow={setShow}
					selected={selected}
					setSelected={setSelected}
					label={label}
					setHover={setHover}
					options={options}
					placeholder={placeholder}
					setSearchTerm={setSearchTerm}
				/>
			);
		case "search":
			return (
				<StringSearch<T>
					entryRef={entryRef}
					menuRef={menuRef}
					show={show}
					setShow={setShow}
					selected={selected}
					setSelected={setSelected}
					label={label}
					setHover={setHover}
					filteredOptions={filteredOptions}
					placeholder={placeholder}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
				/>
			);
	}
};
