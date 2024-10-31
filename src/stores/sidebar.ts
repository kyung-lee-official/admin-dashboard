import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const enum MenuKey {
	HOME,
	CHITUBOX_DOCS_ANALYTICS,
	KPI,
	SNS_CRAWLER,
}

export type SubMenuItem = {
	title: string;
	link: string;
};

type Menu = {
	menuKey: MenuKey;
	subMenu: SubMenuItem[];
};

type State = {
	selectedMenu: MenuKey | null;
	selectedSubMenu: SubMenuItem | null;
	menus: Menu[];
};

type Action = {
	setSelectedMenu: (menuKey: MenuKey) => void;
	setSelectedSubMenu: (menuKey: MenuKey, link: string) => void;
};

export const useSidebarStore = create<State & Action>()(
	devtools(
		(set) => ({
			selectedMenu: null,
			selectedSubMenu: null,
			menus: [
				{
					menuKey: MenuKey.HOME,
					subMenu: [{ title: "Home Page", link: "/home" }],
				},
				{
					menuKey: MenuKey.CHITUBOX_DOCS_ANALYTICS,
					subMenu: [
						{
							title: "CHITUBOX Docs User Feedback",
							link: "/chitubox-docs-analytics/chitubox-docs-user-feedback",
						},
						{
							title: "CHITUBOX Docs Page Views",
							link: "/chitubox-docs-analytics/chitubox-docs-page-views",
						},
						{
							title: "CHITUBOX Docs Ads",
							link: "/chitubox-docs-analytics/chitubox-docs-advertisement",
						},
					],
				},
				{
					menuKey: MenuKey.KPI,
					subMenu: [{ title: "KPI", link: "/kpi" }],
				},

				{
					menuKey: MenuKey.SNS_CRAWLER,
					subMenu: [
						{
							title: "SNS Crawler",
							link: "/sns-crawler",
						},
					],
				},
			],
			setSelectedMenu: (menuKey: MenuKey) => {
				return set((state) => {
					return {
						selectedMenu: menuKey,
					};
				});
			},
			setSelectedSubMenu: (menuKey: MenuKey, link: string) => {
				return set((state) => {
					let subMenu;
					for (const menu of state.menus) {
						if (menu.menuKey === menuKey) {
							subMenu = menu.subMenu.find((subMenu) => {
								return subMenu.link === link;
							});
						}
					}
					return {
						selectedSubMenu: subMenu,
					};
				});
			},
		}),
		{
			name: "sidebar",
		}
	)
);
