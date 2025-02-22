"use client";

import { Toggle } from "@/components/toggle/Toggle";
import { Theme, useThemeStore } from "@/stores/theme";

const Content = () => {
	const theme = useThemeStore((state) => state.theme);
	const setTheme = useThemeStore((state) => state.setTheme);

	console.log(theme);

	return (
		<div className="w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				rounded-md border-[1px] border-white/10 border-t-white/15"
			>
				<div
					className="flex justify-between py-4 px-3
					text-sm"
				>
					<div className="w-full">Dark Theme</div>
					<div>
						<Toggle
							isOn={theme === Theme.DARK}
							isAllowed={true}
							onClick={() => {
								setTheme(
									theme === Theme.DARK
										? Theme.LIGHT
										: Theme.DARK
								);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Content;
