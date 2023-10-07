"use client";

import { useState } from "react";
import { ContentRegion } from "./ContentRegion";
import { SidebarRegion } from "./SidebarRegion";

export const Settings = (props: any) => {
	const { metaData, setShowSettings } = props;
	const [activePath, setActivePath] = useState<string>(
		metaData[0].items[0].path
	);

	return (
		<div className="flex justify-center w-full">
			<SidebarRegion
				metaData={metaData}
				activePath={activePath}
				setActivePath={setActivePath}
			/>
			<ContentRegion
				metaData={metaData}
				setShowSettings={setShowSettings}
				activePath={activePath}
				setActivePath={setActivePath}
			/>
		</div>
	);
};
