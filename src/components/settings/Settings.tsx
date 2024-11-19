"use client";

import { ContentRegion } from "./ContentRegion";

export const Settings = (props: any) => {
	const { metaData, setShowSettings } = props;

	return (
		<div className="flex justify-center w-full">
			<ContentRegion
				metaData={metaData}
				setShowSettings={setShowSettings}
			/>
		</div>
	);
};
