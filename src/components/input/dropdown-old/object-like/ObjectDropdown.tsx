import { useCallback, useEffect, useRef, useState } from "react";
import { ObjectLike } from "../Dropdown";
import { ObjectRegular } from "./ObjectRegular";
import { ObjectSearch } from "./ObjectSearch";

export const ObjectDropdown = <T,>(props: ObjectLike<T>) => {
	const {
		mode,
		selected,
		setSelected,
		setHover,
		options,
		label,
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
					String(item[label.primaryKey])
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					(label.secondaryKey &&
						String(item[label.secondaryKey])
							.toLowerCase()
							.includes(searchTerm.toLowerCase()))
				);
			});
			setFilteredOptions(filtered);
		} else {
			setFilteredOptions(options);
		}
	}, [searchTerm, options]);

	switch (mode) {
		case "regular":
			return (
				<ObjectRegular<T>
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
					sortBy={sortBy}
				/>
			);
		case "search":
			return (
				<ObjectSearch<T>
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
					sortBy={sortBy}
				/>
			);
	}
};
