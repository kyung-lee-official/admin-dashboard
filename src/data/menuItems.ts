export const enum MenuKey {
	HOME,
	CHITUBOX_DOCS_ANALYTICS,
	CHITUBOX_DOCS_USER_FEEDBACK,
	CHITUBOX_DOCS_ADVERTISEMENT,
	KPI,
	SNS_CRAWLER,
	SETTINGS,
	MY_ACCOUNT,
}

export type MenuItem = {
	menuKey: MenuKey;
	title: string;
	link: string;
	pageUrl: string;
	subMenu?: MenuItem[];
};

export const menuItems: MenuItem[] = [
	{
		menuKey: MenuKey.HOME,
		title: "Home",
		link: "/home",
		pageUrl: "/home",
	},
	{
		menuKey: MenuKey.CHITUBOX_DOCS_ANALYTICS,
		title: "CHITUBOX Docs Analytics",
		link: "/app/chitubox-docs-analytics/chitubox-docs-user-feedback",
		pageUrl: "/app/chitubox-docs-analytics/chitubox-docs-user-feedback",
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
	},
	{
		menuKey: MenuKey.SNS_CRAWLER,
		title: "SNS Crawler",
		link: "/app/sns-crawler",
		pageUrl: "/app/sns-crawler",
	},
	{
		menuKey: MenuKey.SETTINGS,
		title: "Settings",
		link: "/home",
		pageUrl: "/settings",
	},
	{
		menuKey: MenuKey.MY_ACCOUNT,
		title: "My Account",
		link: "/settings/my-account",
		pageUrl: "/settings/my-account",
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

export const flattenMenu = flatten(menuItems);
