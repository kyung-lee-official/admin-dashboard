"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Toggle } from "@/components/toggle/Toggle";
import { Theme, useThemeStore } from "@/stores/theme";

const Content = () => {
	const theme = useThemeStore((state) => state.theme);
	const setTheme = useThemeStore((state) => state.setTheme);

	return (
		<PageContainer>
			<PageBlock
				title="Dark Theme"
				moreMenu={
					<Toggle
						isOn={theme === Theme.DARK}
						isAllowed={true}
						onClick={() => {
							setTheme(
								theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
							);
						}}
					/>
				}
			></PageBlock>
		</PageContainer>
	);
};

export default Content;
