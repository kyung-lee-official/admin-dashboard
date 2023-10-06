"use client";

import { CircleCheckIcon } from "@/components/icons/Icons";
import { Theme, useThemeStore } from "@/stores/theme";
import { SettingsHeading, SettingsSubHeading } from "../../ContentRegion";

const ThemeOption = (props: any) => {
	const { label } = props;
	const { theme, setTheme } = useThemeStore();

	return (
		<div
			className={`relative w-16 h-16 
			${label === Theme.LIGHT ? "bg-white" : "bg-gray-700"} rounded-full shadow-md
			${label === theme && "border-2 border-blue-500"} hover:cursor-pointer`}
			onClick={() => {
				setTheme(label);
			}}
		>
			{label === theme && (
				<div
					className={`absolute right-0 w-5 h-5 flex justify-center items-center 
					text-white bg-blue-500 rounded-full`}
				>
					<CircleCheckIcon size={20} />
				</div>
			)}
		</div>
	);
};

export const Appearance = () => {
	return (
		<div>
			<SettingsHeading>Appearance</SettingsHeading>
			<SettingsSubHeading>THEME</SettingsSubHeading>
			<div className="flex gap-8">
				<ThemeOption label={Theme.LIGHT} />
				<ThemeOption label={Theme.DARK} />
			</div>
		</div>
	);
};
