"use client";

import { CloseIcon } from "../icons/Icons";
import { Members } from "./serverSettings/pages/Members";
import { Roles } from "./serverSettings/pages/Roles/Roles";

export const SettingsHeading = (props: any) => {
	const { children } = props;
	return <h1 className="text-xl text-neutral-600 font-bold">{children}</h1>;
};

export const SettingsSubHeading = (props: any) => {
	const { children } = props;
	return (
		<h2 className="text-xs text-neutral-500 font-bold my-2">{children}</h2>
	);
};

const ActiveComponent = (props: any) => {
	const { activeItem } = props;
	switch (activeItem.path) {
		case "/memberManagement/roles":
			return <Roles />;
			break;

		case "/memberManagement/members":
			return <Members />;
			break;

		default:
			return <div></div>;
			break;
	}
};

export const ContentRegion = (props: any) => {
	const { metaData, setShowSettings } = props;

	return (
		<div
			className="flex-[6_0_740px] flex justify-start h-screen
			bg-white dark:bg-neutral-700
			overflow-auto scrollbar"
		>
			<div className="relative w-[740px] px-10">
				<div className="h-12" />
				<ActiveComponent activeItem={"/memberManagement/roles"} />
				<div className="h-12" />
			</div>
		</div>
	);
};
