import {
	Crawler,
	Home,
	Manual,
	PerformanceIcon,
	ReturnIcon,
} from "@/components/icons/Icons";
import Link from "next/link";

export const enum MenuKey {
	HOME,
	CHITUBOX_DOCS_ANALYTICS,
	CHITUBOX_DOCS_USER_FEEDBACK,
	CHITUBOX_DOCS_ADVERTISEMENT,
	PERFORMANCE,
	PERFORMANCE_EVENTS,
	PERFORMANCE_EVENT_TEMPLATES,
	PERFORMANCE_STATS,
	PERFORMANCE_STAT,
	PERFORMANCE_SECTION,
	PERFORMANCE_EVENT,
	SNS_CRAWLER,
	SETTINGS,
	GENERAL,
	MY_ACCOUNT,
	SIGN_UP,
	ROLES,
	PROFILE,
}

export type HierarchicalMenuItem = {
	menuKey: MenuKey /* key used to highlight the current menu item */;
	isActive: boolean;
	link: string /* where to go when clicked */;
	pageUrlReg?: RegExp /* the regex of url of current page. if the item is a sub-menu (without page), should be ignored */;
	title?: string;
	breadcrumbs?: (props: any) => JSX.Element;
	icon?: JSX.Element;
	subMenu?: HierarchicalMenuItem[];
};

// export type FlattenMenuItem = {
// 	menuKey: MenuKey;
// 	level: number;
// 	link: string /* where to go when clicked */;
// 	pageUrlReg?: RegExp /* the regex of url of current page, should be ignored if page does not exist */;
// 	title?: string;
// 	breadcrumbs?: (props: any) => JSX.Element;
// 	icon?: JSX.Element;
// 	subMenu?: HierarchicalMenuItem[];
// };

export const homeMenuItem: HierarchicalMenuItem[] = [
	{
		menuKey: MenuKey.HOME,
		isActive: false,
		title: "Home",
		link: "/home",
		pageUrlReg: /^\/home$/,
		icon: <Home size="20" />,
	},
];

export const menuItems: HierarchicalMenuItem[] = [
	{
		menuKey: MenuKey.CHITUBOX_DOCS_ANALYTICS,
		isActive: false,
		title: "CHITUBOX Docs Analytics",
		link: "/app/chitubox-docs-analytics/chitubox-docs-user-feedback",
		icon: <Manual size="20" />,
		subMenu: [
			{
				menuKey: MenuKey.CHITUBOX_DOCS_USER_FEEDBACK,
				isActive: false,
				title: "CHITUBOX Docs User Feedback",
				link: "/app/chitubox-docs-analytics/chitubox-docs-user-feedback",
				pageUrlReg:
					/^\/app\/chitubox-docs-analytics\/chitubox-docs-user-feedback$/,
			},
			{
				menuKey: MenuKey.CHITUBOX_DOCS_ADVERTISEMENT,
				isActive: false,
				title: "CHITUBOX Docs Page Views",
				link: "/app/chitubox-docs-analytics/chitubox-docs-page-views",
				pageUrlReg:
					/^\/app\/chitubox-docs-analytics\/chitubox-docs-page-views$/,
			},
			{
				menuKey: MenuKey.CHITUBOX_DOCS_ADVERTISEMENT,
				isActive: false,
				title: "CHITUBOX Docs Ads",
				link: "/app/chitubox-docs-analytics/chitubox-docs-advertisement",
				pageUrlReg:
					/^\/app\/chitubox-docs-analytics\/chitubox-docs-advertisement$/,
			},
		],
	},
	{
		menuKey: MenuKey.PERFORMANCE,
		isActive: false,
		title: "Performance",
		link: "/app/performance/stats",
		icon: <PerformanceIcon size="20" />,
		subMenu: [
			{
				menuKey: MenuKey.PERFORMANCE_STATS,
				isActive: false,
				title: "Peformance Stats",
				link: "/app/performance/stats",
				pageUrlReg: /^\/app\/performance\/stats$/,
				subMenu: [
					{
						menuKey: MenuKey.PERFORMANCE_STATS,
						isActive: false,
						link: "/app/performance/stats",
						breadcrumbs: (props: { statId: number }) => {
							const { statId } = props;
							return (
								<div>
									<Link href="/app/performance/stats">
										Peformance Stats
									</Link>
									&nbsp;&gt;&nbsp;
									<Link
										href={`/app/performance/stats/${statId}`}
									>
										Stat
									</Link>
								</div>
							);
						},
						pageUrlReg: /^\/app\/performance\/stats\/[0-9]*$/,
					},
				],
			},
			{
				menuKey: MenuKey.PERFORMANCE_EVENT_TEMPLATES,
				isActive: false,
				title: "Performance Event Templates",
				link: "/app/performance/event-templates",
				pageUrlReg: /^\/app\/performance\/event-templates$/,
			},
			{
				menuKey: MenuKey.PERFORMANCE_EVENTS,
				isActive: false,
				title: "Performance Events",
				link: "/app/performance/events",
				pageUrlReg: /^\/app\/performance\/events$/,
			},
		],
	},
	{
		menuKey: MenuKey.SNS_CRAWLER,
		isActive: false,
		title: "SNS Crawler",
		link: "/app/sns-crawler",
		pageUrlReg: /^\/app\/sns-crawler$/,
		icon: <Crawler size="20" />,
	},
];

export const settingsReturnMenuItem: HierarchicalMenuItem[] = [
	{
		menuKey: MenuKey.SETTINGS,
		isActive: false,
		title: "Settings",
		link: "/home",
		pageUrlReg: /^\/settings\/general$/,
		icon: <ReturnIcon size="20" />,
	},
];

export const settingsGeneralMenuItems: HierarchicalMenuItem[] = [
	{
		menuKey: MenuKey.SIGN_UP,
		isActive: false,
		title: "Sign Up",
		link: "/settings/general/sign-up",
		pageUrlReg: /^\/settings\/general\/sign-up$/,
	},
	{
		menuKey: MenuKey.ROLES,
		isActive: false,
		title: "Roles",
		link: "/settings/general/roles",
		pageUrlReg: /^\/settings\/general\/roles$/,
	},
];

export const settingsMyAccountMenuItems: HierarchicalMenuItem[] = [
	{
		menuKey: MenuKey.PROFILE,
		isActive: false,
		title: "Profile",
		link: "/settings/my-account/profile",
		pageUrlReg: /^\/settings\/my-account\/profile$/,
	},
];

// const flatten = (
// 	menuItems: HierarchicalMenuItem[],
// 	prevLevel = 0
// ): FlattenMenuItem[] => {
// 	const result: FlattenMenuItem[] = [];
// 	for (const i of menuItems) {
// 		result.push({ ...i, level: prevLevel + 1 });
// 		if (i.subMenu) {
// 			result.push(...flatten(i.subMenu, prevLevel + 1));
// 		}
// 	}
// 	return result;
// };

// export const flattenMenu = flatten(
// 	homeMenuItem
// 		.concat(menuItems)
// 		.concat(settingsReturnMenuItem)
// 		.concat(settingsGeneralMenuItems)
// 		.concat(settingsMyAccountMenuItems)
// );

export const menu = homeMenuItem
	.concat(menuItems)
	.concat(settingsReturnMenuItem)
	.concat(settingsGeneralMenuItems)
	.concat(settingsMyAccountMenuItems);
