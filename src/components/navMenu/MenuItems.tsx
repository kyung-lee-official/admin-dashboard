import {
	Crawler,
	Home,
	Manual,
	PerformanceIcon,
	ReturnIcon,
} from "@/components/icons/Icons";

export const enum MenuKey {
	HOME,
	CHITUBOX_DOCS_ANALYTICS,
	CHITUBOX_DOCS_USER_FEEDBACK,
	CHITUBOX_DOCS_ADVERTISEMENT,
	KPI,
	SNS_CRAWLER,
	SETTINGS,
	GENERAL,
	MY_ACCOUNT,
	SIGN_UP,
	ROLES,
	PROFILE,
}

export type MenuItem = {
	menuKey: MenuKey;
	title: string;
	link: string;
	pageUrl?: string;
	icon?: JSX.Element;
	subMenu?: MenuItem[];
};

export const homeMenuItem: MenuItem[] = [
	{
		menuKey: MenuKey.HOME,
		title: "Home",
		link: "/home",
		pageUrl: "/home",
		icon: <Home size="20" />,
	},
];

export const menuItems: MenuItem[] = [
	{
		menuKey: MenuKey.CHITUBOX_DOCS_ANALYTICS,
		title: "CHITUBOX Docs Analytics",
		link: "/app/chitubox-docs-analytics/chitubox-docs-user-feedback",
		icon: <Manual size="20" />,
		subMenu: [
			{
				menuKey: MenuKey.CHITUBOX_DOCS_USER_FEEDBACK,
				title: "CHITUBOX Docs User Feedback",
				link: "/app/chitubox-docs-analytics/chitubox-docs-user-feedback",
				pageUrl:
					"/app/chitubox-docs-analytics/chitubox-docs-user-feedback",
			},
			{
				menuKey: MenuKey.CHITUBOX_DOCS_ADVERTISEMENT,
				title: "CHITUBOX Docs Page Views",
				link: "/app/chitubox-docs-analytics/chitubox-docs-page-views",
				pageUrl:
					"/app/chitubox-docs-analytics/chitubox-docs-page-views",
			},
			{
				menuKey: MenuKey.CHITUBOX_DOCS_ADVERTISEMENT,
				title: "CHITUBOX Docs Ads",
				link: "/app/chitubox-docs-analytics/chitubox-docs-advertisement",
				pageUrl:
					"/app/chitubox-docs-analytics/chitubox-docs-advertisement",
			},
		],
	},
	{
		menuKey: MenuKey.KPI,
		title: "KPI",
		link: "/app/kpi",
		pageUrl: "/app/kpi",
		icon: <PerformanceIcon size="20" />,
	},
	{
		menuKey: MenuKey.SNS_CRAWLER,
		title: "SNS Crawler",
		link: "/app/sns-crawler",
		pageUrl: "/app/sns-crawler",
		icon: <Crawler size="20" />,
	},
];

export const settingsReturnMenuItem: MenuItem[] = [
	{
		menuKey: MenuKey.SETTINGS,
		title: "Settings",
		link: "/home",
		pageUrl: "/settings/general",
		icon: <ReturnIcon size="20" />,
	},
];

export const settingsGeneralMenuItems: MenuItem[] = [
	{
		menuKey: MenuKey.SIGN_UP,
		title: "Sign Up",
		link: "/settings/general/sign-up",
		pageUrl: "/settings/general/sign-up",
	},
	{
		menuKey: MenuKey.ROLES,
		title: "Roles",
		link: "/settings/general/roles",
		pageUrl: "/settings/general/roles",
	},
];

export const settingsMyAccountMenuItems: MenuItem[] = [
	{
		menuKey: MenuKey.PROFILE,
		title: "Profile",
		link: "/settings/my-account/profile",
		pageUrl: "/settings/my-account/profile",
	},
];

const flatten = (menuItems: MenuItem[]): MenuItem[] => {
	const result: MenuItem[] = [];
	for (const i of menuItems) {
		result.push(i);
		if (i.subMenu) {
			result.push(...flatten(i.subMenu));
		}
	}
	return result;
};

export const flattenMenu = flatten(
	homeMenuItem
		.concat(menuItems)
		.concat(settingsReturnMenuItem)
		.concat(settingsGeneralMenuItems)
		.concat(settingsMyAccountMenuItems)
);
