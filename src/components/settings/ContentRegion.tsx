"use client";

import { CloseIcon } from "../icons/Icons";
import { Groups } from "./serverSettings/pages/Groups/Groups";
import { Members } from "./serverSettings/pages/Members";
import { Overview } from "./serverSettings/pages/Overview";
import { Roles } from "./serverSettings/pages/Roles/Roles";
import { Server } from "./serverSettings/pages/Server";
import { Appearance } from "./memberSettings/pages/Appearance";
import { MyAccount } from "./memberSettings/pages/MyAccount/MyAccount";

export const SettingsHeading = (props: any) => {
	const { children } = props;
	return (
		<h1 className="text-xl text-neutral-600 font-bold">
			{children}
		</h1>
	);
};

export const SettingsSubHeading = (props: any) => {
	const { children } = props;
	return <h2 className="text-xs text-neutral-500 font-bold my-2">{children}</h2>;
};

const ActiveComponent = (props: any) => {
	const { activeItem, setActivePath } = props;
	switch (activeItem.path) {
		case "/serverSettings/overview":
			return <Overview />;
			break;

		case "/serverSettings/server":
			return <Server />;
			break;

		case "/memberManagement/roles":
			return <Roles />;
			break;

		case "/memberManagement/groups":
			return <Groups />;
			break;

		case "/memberManagement/members":
			return <Members setActivePath={setActivePath} />;
			break;

		case "/memberSettings/myAccount":
			return <MyAccount />;
			break;

		case "/appSettings/appearance":
			return <Appearance />;
			break;

		default:
			return <div></div>;
			break;
	}
};

export const ContentRegion = (props: any) => {
	const { metaData, setShowSettings, activePath, setActivePath } = props;
	const flattenItems = metaData.map((section: any) => section.items).flat();
	const activeItem = flattenItems.find(
		(page: any) => page.path === activePath
	);

	return (
		<div
			className="flex-[6_0_740px] flex justify-start h-screen
			bg-white dark:bg-neutral-700
			overflow-auto scrollbar"
		>
			<div className="relative w-[740px] px-10">
				<div className="h-12" />
				<ActiveComponent
					activeItem={activeItem}
					setActivePath={setActivePath}
				/>
				<div className="h-12" />
			</div>
			<div
				className="sticky top-12 right-0 h-12 w-12 flex justify-center items-center
				text-neutral-500"
			>
				<div
					className="cursor-pointer"
					onClick={() => {
						setShowSettings(false);
					}}
				>
					<CloseIcon />
				</div>
			</div>
		</div>
	);
};
