import {
	Crawler,
	Home,
	Manual,
	PerformanceIcon,
	ReturnIcon,
} from "@/components/icons/Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "./ArrowRight";

export const enum MenuKey {
	HOME,
	CHITUBOX_DOCS_ANALYTICS,
	CHITUBOX_DOCS_USER_FEEDBACK,
	CHITUBOX_DOCS_ADVERTISEMENT,
	PERFORMANCE,
	PERFORMANCE_STATS,
	PERFORMANCE_STAT,
	PERFORMANCE_SECTION,
	PERFORMANCE_CREATE_EVENT,
	PERFORMANCE_EVENT,
	PERFORMANCE_EVENT_TEMPLATES,
	PERFORMANCE_EVENT_TEMPLATE,
	SNS_CRAWLER,
	SNS_CRAWLER_FACEBOOK_GROUP,
	SNS_CRAWLER_FACEBOOK_GROUP_SOURCE_DATA,
	SNS_CRAWLER_FACEBOOK_GROUP_CRAWLER_TASKS,
	SETTINGS,
	GENERAL,
	MY_ACCOUNT,
	SIGN_UP,
	ROLES,
	APPEARANCE,
	PROFILE,
}

export type HierarchicalMenuItem = {
	menuKey: MenuKey /* key used to highlight the current menu item */;
	isActive: boolean;
	link?: string /* where to go when clicked, can be ignored if it is not a menu item. */;
	pageUrlReg?: RegExp /* the regex of url of current page. if the item is a sub-menu (without page), should be ignored */;
	title?: string;
	breadcrumbs?: (props: any) => JSX.Element;
	icon?: JSX.Element;
	subMenu?: HierarchicalMenuItem[];
};
/**
 * check if the current page is or belongs to the menu by checking its pageUrlReg
 * used to highlight the first two levels of the menu
 * @param m menu
 * @returns boolean
 */
export function updateIsActive(m: HierarchicalMenuItem[]) {
	const pathname = usePathname();
	function checkRecursively(m: HierarchicalMenuItem[]): any {
		let result = false;
		for (const item of m) {
			if (item.pageUrlReg) {
				/* has pageUrlReg */
				item.isActive = item.pageUrlReg.test(pathname);
				if (item.isActive) {
					result = true;
				} else {
					/* not matched, check its subMenu */
					if (item.subMenu) {
						result = checkRecursively(item.subMenu);
						item.isActive = result;
					}
				}
			} else {
				/* no pageUrlReg */
				if (item.subMenu) {
					/* has subMenu */
					result = checkRecursively(item.subMenu);
					item.isActive = result;
				} else {
					/* no subMenu, do nothing */
				}
			}
		}
		return result;
	}
	checkRecursively(m);
}

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
						menuKey: MenuKey.PERFORMANCE_STAT,
						isActive: false,
						breadcrumbs: (props: { statId: number }) => {
							const { statId } = props;
							return (
								<div className="flex items-center gap-2 flex-wrap">
									<Link href="/app/performance/stats">
										Peformance Stats
									</Link>
									<ArrowRight size={15} />
									<Link
										href={`/app/performance/stats/${statId}`}
									>
										Stat
									</Link>
								</div>
							);
						},
						pageUrlReg: /^\/app\/performance\/stats\/[0-9]*$/,
						subMenu: [
							{
								menuKey: MenuKey.PERFORMANCE_SECTION,
								isActive: false,
								breadcrumbs: (props: {
									statId: number;
									sectionId: number;
								}) => {
									const { statId, sectionId } = props;
									return (
										<div className="flex items-center gap-2 flex-wrap">
											<Link href="/app/performance/stats">
												Peformance Stats
											</Link>
											<ArrowRight size={15} />
											<Link
												href={`/app/performance/stats/${statId}`}
											>
												Stat
											</Link>
											<ArrowRight size={15} />
											<Link
												href={`/app/performance/stats/${statId}/section/${sectionId}`}
											>
												Section
											</Link>
										</div>
									);
								},
								pageUrlReg:
									/^\/app\/performance\/stats\/[0-9]*\/section\/[0-9]*$/,
								subMenu: [
									{
										menuKey:
											MenuKey.PERFORMANCE_CREATE_EVENT,
										isActive: false,
										breadcrumbs: (props: {
											statId: number;
											sectionId: number;
										}) => {
											const { statId, sectionId } = props;
											return (
												<div className="flex items-center gap-2 flex-wrap">
													<Link href="/app/performance/stats">
														Peformance Stats
													</Link>
													<ArrowRight size={15} />
													<Link
														href={`/app/performance/stats/${statId}`}
													>
														Stat
													</Link>
													<ArrowRight size={15} />
													<Link
														href={`/app/performance/stats/${statId}/section/${sectionId}`}
													>
														Section
													</Link>
													<ArrowRight size={15} />
													<Link
														href={`/app/performance/stats/${statId}/section/${sectionId}/create-event`}
													>
														Create Event
													</Link>
												</div>
											);
										},
										pageUrlReg:
											/^\/app\/performance\/stats\/[0-9]*\/section\/[0-9]*\/create\-event$/,
									},
									{
										menuKey: MenuKey.PERFORMANCE_EVENT,
										isActive: false,
										breadcrumbs: (props: {
											statId: number;
											sectionId: number;
											eventId: number;
										}) => {
											const {
												statId,
												sectionId,
												eventId,
											} = props;
											return (
												<div className="flex items-center gap-2 flex-wrap">
													<Link href="/app/performance/stats">
														Peformance Stats
													</Link>
													<ArrowRight size={15} />
													<Link
														href={`/app/performance/stats/${statId}`}
													>
														Stat
													</Link>
													<ArrowRight size={15} />
													<Link
														href={`/app/performance/stats/${statId}/section/${sectionId}`}
													>
														Section
													</Link>
													<ArrowRight size={15} />
													<Link
														href={`/app/performance/stats/${statId}/section/${sectionId}/event/${eventId}`}
													>
														Event
													</Link>
												</div>
											);
										},
										pageUrlReg:
											/^\/app\/performance\/stats\/[0-9]*\/section\/[0-9]*\/event\/[0-9]*$/,
									},
								],
							},
						],
					},
				],
			},
			{
				menuKey: MenuKey.PERFORMANCE_EVENT_TEMPLATES,
				isActive: false,
				title: "Performance Event Templates",
				link: "/app/performance/event-templates",
				subMenu: [
					{
						menuKey: MenuKey.PERFORMANCE_EVENT_TEMPLATE,
						isActive: false,
						breadcrumbs: (props: { templateId: number }) => {
							const { templateId } = props;
							return (
								<div className="flex items-center gap-2 flex-wrap">
									<Link href="/app/performance/event-templates">
										Performance Event Templates
									</Link>
									<ArrowRight size={15} />
									<Link
										href={`/app/performance/event-templates/${templateId}`}
									>
										Template
									</Link>
								</div>
							);
						},
						pageUrlReg:
							/^\/app\/performance\/event-templates\/[0-9]*$/,
					},
				],
				pageUrlReg: /^\/app\/performance\/event-templates$/,
			},
		],
	},
	{
		menuKey: MenuKey.SNS_CRAWLER,
		isActive: false,
		link: "/app/sns-crawler/facebook-group",
		title: "SNS Crawler",
		subMenu: [
			{
				menuKey: MenuKey.SNS_CRAWLER_FACEBOOK_GROUP,
				isActive: false,
				title: "Facebook Group",
				link: "/app/sns-crawler/facebook-group",
				pageUrlReg: /^\/app\/sns-crawler\/facebook-group$/,
				subMenu: [
					{
						menuKey: MenuKey.SNS_CRAWLER_FACEBOOK_GROUP_SOURCE_DATA,
						isActive: false,
						breadcrumbs: () => {
							return (
								<div className="flex items-center gap-2 flex-wrap">
									<Link href="/app/sns-crawler/facebook-group">
										Facebook Group
									</Link>
									<ArrowRight size={15} />
									<Link
										href={`/app/sns-crawler/facebook-group/source-data`}
									>
										Source Data
									</Link>
								</div>
							);
						},
						link: "/app/sns-crawler/facebook-group/source-data",
						pageUrlReg:
							/^\/app\/sns-crawler\/facebook-group\/source-data$/,
					},
					{
						menuKey:
							MenuKey.SNS_CRAWLER_FACEBOOK_GROUP_CRAWLER_TASKS,
						isActive: false,
						breadcrumbs: () => {
							return (
								<div className="flex items-center gap-2 flex-wrap">
									<Link href="/app/sns-crawler/facebook-group">
										Facebook Group
									</Link>
									<ArrowRight size={15} />
									<Link
										href={`/app/sns-crawler/facebook-group/crawler-tasks`}
									>
										Crawler Tasks
									</Link>
								</div>
							);
						},
						title: "Crawler Tasks",
						link: "/app/sns-crawler/facebook-group/crawler-tasks",
						pageUrlReg:
							/^\/app\/sns-crawler\/facebook-group\/crawler-tasks$/,
					},
				],
			},
		],
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
	{
		menuKey: MenuKey.APPEARANCE,
		isActive: false,
		title: "Appearance",
		link: "/settings/general/appearance",
		pageUrlReg: /^\/settings\/general\/appearance$/,
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

export const menu = homeMenuItem
	.concat(menuItems)
	.concat(settingsReturnMenuItem)
	.concat(settingsGeneralMenuItems)
	.concat(settingsMyAccountMenuItems);
