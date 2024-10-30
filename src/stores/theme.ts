import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const enum Theme {
	LIGHT = "LIGHT",
	DARK = "DARK",
}

type State = {
	theme: Theme;
};

type Action = {
	setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<State & Action>()(
	devtools(
		persist(
			(set) => ({
				theme: Theme.DARK,
				setTheme: (theme: Theme) => {
					return set((state) => {
						return { theme: theme };
					});
				},
			}),
			{
				name: "theme-storage",
			}
		),
		{
			name: "theme",
		}
	)
);
