export const enum MenuKey {
	HOME,
	CHITUBOX_DOCS_ANALYTICS,
	CHITUBOX_DOCS_USER_FEEDBACK,
	CHITUBOX_DOCS_ADVERTISEMENT,
	KPI,
	SNS_CRAWLER,
}

export type MenuItem = {
	menuKey: MenuKey;
	title: string;
	link: string;
	subMenu?: MenuItem[];
};

export const menuItems: MenuItem[] = [
	{
		menuKey: MenuKey.HOME,
		title: "Home",
		link: "/home",
	},
	{
		menuKey: MenuKey.CHITUBOX_DOCS_ANALYTICS,
		title: "CHITUBOX Docs Analytics",
		link: "/chitubox-docs-analytics/chitubox-docs-user-feedback",
		subMenu: [
			{
				menuKey: MenuKey.CHITUBOX_DOCS_USER_FEEDBACK,
				title: "CHITUBOX Docs User Feedback",
				link: "/chitubox-docs-analytics/chitubox-docs-user-feedback",
			},
			{
				menuKey: MenuKey.CHITUBOX_DOCS_ADVERTISEMENT,
				title: "CHITUBOX Docs Page Views",
				link: "/chitubox-docs-analytics/chitubox-docs-page-views",
			},
			{
				menuKey: MenuKey.CHITUBOX_DOCS_ADVERTISEMENT,
				title: "CHITUBOX Docs Ads",
				link: "/chitubox-docs-analytics/chitubox-docs-advertisement",
			},
		],
	},
	{
		menuKey: MenuKey.KPI,
		title: "KPI",
		link: "/kpi",
	},
	{
		menuKey: MenuKey.SNS_CRAWLER,
		title: "SNS Crawler",
		link: "/sns-crawler",
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
