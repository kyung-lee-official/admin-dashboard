import { uniq } from "@/utilities/data/data";
import React from "react";

export const CheckboxList = (props: {
	availableOptions: any[];
	newSelectedOptions: any[];
	setNewSelectedOptions: React.Dispatch<React.SetStateAction<any[]>>;
	itemKey: string;
}) => {
	const {
		availableOptions,
		newSelectedOptions,
		setNewSelectedOptions,
		itemKey,
	} = props;
	return (
		<ul
			className="flex flex-col justify-start items-start w-full h-44 gap-1 p-4
			bg-gray-200 rounded scrollbar
			overflow-y-scroll"
		>
			{availableOptions?.map((availableOption: any) => {
				return (
					<CheckboxItem
						key={availableOption.id}
						option={availableOption}
						newSelectedOptions={newSelectedOptions}
						setNewSelectedOptions={setNewSelectedOptions}
					>
						{availableOption[itemKey]}
					</CheckboxItem>
				);
			})}
		</ul>
	);
};

const CheckboxItem = (props: {
	children: any;
	option: any;
	newSelectedOptions: any[];
	setNewSelectedOptions: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
	const { children, option, newSelectedOptions, setNewSelectedOptions } =
		props;

	const checked = newSelectedOptions.some(
		(newSelectedOption: any) => newSelectedOption.id === option.id
	);

	return (
		<li
			className="flex justify-between items-center gap-2 w-full px-2 py-1
			hover:bg-gray-300 rounded cursor-pointer select-none"
			onClick={() => {
				if (checked) {
					setNewSelectedOptions(
						newSelectedOptions.filter(
							(newSelectedOption: any) =>
								newSelectedOption.id !== option.id
						)
					);
				} else {
					setNewSelectedOptions(
						uniq([...newSelectedOptions, option])
					);
				}
			}}
		>
			<div>{children}</div>
			<Checkbox checked={checked} />
		</li>
	);
};

const Checkbox = (props: { checked: boolean }) => {
	const { checked } = props;

	return checked ? (
		<div className="text-blue-500 rounded-md overflow-hidden">
			<CheckSquareFillIcon />
		</div>
	) : (
		<div
			className="w-4 h-4 
			bg-slate-200 
			border-2 border-slate-300
			rounded-md"
		></div>
	);
};

const CheckSquareFillIcon = () => {
	return (
		<svg
			viewBox="0 0 16 16"
			height={"16px"}
			width={"16px"}
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"></path>
		</svg>
	);
};
