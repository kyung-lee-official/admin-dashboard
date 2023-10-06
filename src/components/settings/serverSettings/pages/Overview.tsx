"use client";

import React from "react";
import { SettingsHeading } from "../../ContentRegion";

export const Overview = () => {
	return (
		<div className="flex flex-col gap-6">
			<SettingsHeading>Overview</SettingsHeading>
			<div className="font-normal">
				You can change server settings here. Contact the server
				administrator if you need more permissions.
			</div>
		</div>
	);
};
