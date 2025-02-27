import {
	Crawler,
	Home,
	Manual,
	PerformanceIcon,
	ReturnIcon,
} from "@/components/icons/Icons";

export type HierarchicalMenuItem = {
	/* the regex of url of current page, can be used to highlight the menu item */
	pageUrlReg: RegExp;
	/**
	 * where to go when clicked, can be empty string if it is not a menu item, for example, the third-level route page
	 * which doesn't have an entry in the menu.
	 *
	 * NavMenu can also use href provided in breadcrumbs to navigate to the target page.
	 * if the corresponding page of the link doesn't exist, the page itself should be responsible for redirecting to the target page.
	 */
	breadcrumbs: (props: any) => { href: string; text: string }[];
	icon?: JSX.Element;
	subMenu?: HierarchicalMenuItem[];
};

export const homeMenuItem: HierarchicalMenuItem[] = [
	{
		pageUrlReg: /^\/home$/,
		breadcrumbs: () => {
			return [{ href: "/home", text: "Home" }];
		},
		icon: <Home size="20" />,
	},
];

export const menuItems: HierarchicalMenuItem[] = [
	{
		pageUrlReg: /^\/app\/chitubox-docs-analytics/,
		breadcrumbs: () => {
			return [
				{
					href: "/app/chitubox-docs-analytics",
					text: "CHITUBOX Docs Analytics",
				},
			];
		},
		icon: <Manual size="20" />,
		subMenu: [
			{
				pageUrlReg:
					/^\/app\/chitubox-docs-analytics\/chitubox-docs-user-feedback$/,
				breadcrumbs: () => {
					return [
						{
							href: "/app/chitubox-docs-analytics",
							text: "CHITUBOX Docs Analytics",
						},
						{
							href: "/app/chitubox-docs-analytics/chitubox-docs-user-feedback",
							text: "CHITUBOX Docs User Feedback",
						},
					];
				},
			},
			{
				pageUrlReg:
					/^\/app\/chitubox-docs-analytics\/chitubox-docs-page-views$/,
				breadcrumbs: () => {
					return [
						{
							href: "/app/chitubox-docs-analytics",
							text: "CHITUBOX Docs Analytics",
						},
						{
							href: "/app/chitubox-docs-analytics/chitubox-docs-page-views",
							text: "CHITUBOX Docs Page Views",
						},
					];
				},
			},
			{
				pageUrlReg:
					/^\/app\/chitubox-docs-analytics\/chitubox-docs-advertisement$/,
				breadcrumbs: () => {
					return [
						{
							href: "/app/chitubox-docs-analytics",
							text: "CHITUBOX Docs Analytics",
						},
						{
							href: "/app/chitubox-docs-analytics/chitubox-docs-advertisement",
							text: "CHITUBOX Docs Advertisement",
						},
					];
				},
			},
		],
	},
	{
		pageUrlReg: /^\/app\/performance/,
		breadcrumbs: () => {
			return [
				{
					href: "/app/performance",
					text: "Performance",
				},
			];
		},
		icon: <PerformanceIcon size="20" />,
		subMenu: [
			{
				pageUrlReg: /^\/app\/performance\/stats$/,
				breadcrumbs: () => {
					return [
						{
							href: "/app/performance",
							text: "Performance",
						},
						{
							href: "/app/performance/stats",
							text: "Stats",
						},
					];
				},
				subMenu: [
					{
						pageUrlReg: /^\/app\/performance\/stats\/[0-9]*$/,
						breadcrumbs: (props: { statId: number }) => {
							const { statId } = props;
							return [
								{
									href: "/app/performance/stats",
									text: "Performance",
								},
								{
									href: `/app/performance/stats`,
									text: `Stats`,
								},
								{
									href: `/app/performance/stats/${statId}`,
									text: `Stat ${statId}`,
								},
							];
						},
						subMenu: [
							{
								pageUrlReg:
									/^\/app\/performance\/stats\/[0-9]*\/section\/[0-9]*$/,
								breadcrumbs: (props: {
									statId: number;
									sectionId: number;
								}) => {
									const { statId, sectionId } = props;
									return [
										{
											href: "/app/performance/stats",
											text: "Performance Stats",
										},
										{
											href: `/app/performance/stats/${statId}`,
											text: `Stat ${statId}`,
										},
										{
											href: `/app/performance/stats/${statId}/section/${sectionId}`,
											text: `Section ${sectionId}`,
										},
									];
								},
								subMenu: [
									{
										pageUrlReg:
											/^\/app\/performance\/stats\/[0-9]*\/section\/[0-9]*\/create\-event$/,
										breadcrumbs: (props: {
											statId: number;
											sectionId: number;
										}) => {
											const { statId, sectionId } = props;
											return [
												{
													href: "/app/performance/stats",
													text: "Performance Stats",
												},
												{
													href: `/app/performance/stats/${statId}`,
													text: `Stat ${statId}`,
												},
												{
													href: `/app/performance/stats/${statId}/section/${sectionId}`,
													text: `Section ${sectionId}`,
												},
												{
													href: `/app/performance/stats/${statId}/section/${sectionId}/create-event`,
													text: `Create Event`,
												},
											];
										},
									},
									{
										pageUrlReg:
											/^\/app\/performance\/stats\/[0-9]*\/section\/[0-9]*\/event\/[0-9]*$/,
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
											return [
												{
													href: "/app/performance/stats",
													text: "Performance Stats",
												},
												{
													href: `/app/performance/stats/${statId}`,
													text: `Stat ${statId}`,
												},
												{
													href: `/app/performance/stats/${statId}/section/${sectionId}`,
													text: `Section ${sectionId}`,
												},
												{
													href: `/app/performance/stats/${statId}/section/${sectionId}/event/${eventId}`,
													text: `Event ${eventId}`,
												},
											];
										},
									},
								],
							},
						],
					},
				],
			},
			{
				pageUrlReg: /^\/app\/performance\/event-templates$/,
				breadcrumbs: () => {
					return [
						{
							href: "/app/performance",
							text: "Performance",
						},
						{
							href: "/app/performance/event-templates",
							text: "Performance Event Templates",
						},
					];
				},
				subMenu: [
					{
						pageUrlReg:
							/^\/app\/performance\/event-templates\/[0-9]*$/,
						breadcrumbs: (props: { templateId: number }) => {
							const { templateId } = props;
							return [
								{
									href: "/app/performance/event-templates",
									text: "Performance Event Templates",
								},
								{
									href: `/app/performance/event-templates/${templateId}`,
									text: `Template ${templateId}`,
								},
							];
						},
					},
				],
			},
		],
	},
	{
		pageUrlReg: /^\/app\/sns-crawler$/,
		breadcrumbs: () => {
			return [
				{
					href: "/app/sns-crawler",
					text: "SNS Crawler",
				},
			];
		},
		subMenu: [
			{
				pageUrlReg: /^\/app\/sns-crawler\/facebook-group$/,
				breadcrumbs: () => {
					return [
						{
							href: "/app/sns-crawler",
							text: "SNS Crawler",
						},
						{
							href: "/app/sns-crawler/facebook-group",
							text: "Facebook Group",
						},
					];
				},
				subMenu: [
					{
						pageUrlReg:
							/^\/app\/sns-crawler\/facebook-group\/source-data$/,
						breadcrumbs: () => {
							return [
								{
									href: "/app/sns-crawler",
									text: "SNS Crawler",
								},
								{
									href: "/app/sns-crawler/facebook-group",
									text: "Facebook Group",
								},
								{
									href: `/app/sns-crawler/facebook-group/source-data`,
									text: "Source Data",
								},
							];
						},
					},
					{
						breadcrumbs: () => {
							return [
								{
									href: "/app/sns-crawler",
									text: "SNS Crawler",
								},
								{
									href: "/app/sns-crawler/facebook-group",
									text: "Facebook Group",
								},
								{
									href: `/app/sns-crawler/facebook-group/crawler-tasks`,
									text: "Crawler Tasks",
								},
							];
						},
						pageUrlReg:
							/^\/app\/sns-crawler\/facebook-group\/crawler-tasks$/,
						subMenu: [
							{
								breadcrumbs: (props: { taskId: number }) => {
									const { taskId } = props;
									return [
										{
											href: "/app/sns-crawler/facebook-group",
											text: "Facebook Group",
										},
										{
											href: `/app/sns-crawler/facebook-group/crawler-tasks`,
											text: "Crawler Tasks",
										},
										{
											href: `/app/sns-crawler/facebook-group/crawler-tasks/${taskId}`,
											text: `Task ${taskId}`,
										},
									];
								},
								pageUrlReg:
									/^\/app\/sns-crawler\/facebook-group\/crawler-tasks\/[0-9]*$/,
							},
						],
					},
				],
			},
			{
				pageUrlReg: /^\/app\/sns-crawler\/youtube-data-collector$/,
				breadcrumbs: () => {
					return [
						{
							href: "/app/sns-crawler",
							text: "SNS Crawler",
						},
						{
							href: "/app/sns-crawler/youtube-data-collector",
							text: "YouTube Data Collector",
						},
					];
				},
				subMenu: [
					{
						pageUrlReg:
							/^\/app\/sns-crawler\/youtube-data-collector\/source-data$/,
						breadcrumbs: () => {
							return [
								{
									href: "/app/sns-crawler",
									text: "SNS Crawler",
								},
								{
									href: "/app/sns-crawler/youtube-data-collector",
									text: "YouTube Data Collector",
								},
								{
									href: `/app/sns-crawler/youtube-data-collector/source-data`,
									text: "Source Data",
								},
							];
						},
					},
					{
						pageUrlReg:
							/^\/app\/sns-crawler\/youtube-data-collector\/tasks$/,
						breadcrumbs: () => {
							return [
								{
									href: "/app/sns-crawler",
									text: "SNS Crawler",
								},
								{
									href: "/app/sns-crawler/youtube-data-collector",
									text: "YouTube Data Collector",
								},
								{
									href: `/app/sns-crawler/youtube-data-collector/tasks`,
									text: "YouTube Data Collector Tasks",
								},
							];
						},
						subMenu: [
							{
								pageUrlReg:
									/^\/app\/sns-crawler\/youtube-data-collector\/tasks\/[0-9]*$/,
								breadcrumbs: (props: { taskId: number }) => {
									const { taskId } = props;
									return [
										{
											href: "/app/sns-crawler/youtube-data-collector",
											text: "YouTube Data Collector",
										},
										{
											href: `/app/sns-crawler/youtube-data-collector/tasks`,
											text: "YouTube Data Collector Tasks",
										},
										{
											href: `/app/sns-crawler/youtube-data-collector/tasks/${taskId}`,
											text: `Task ${taskId}`,
										},
									];
								},
							},
						],
					},
				],
			},
		],
		icon: <Crawler size="20" />,
	},
];

export const settingsReturnMenuItem: HierarchicalMenuItem[] = [
	{
		pageUrlReg: /^\/settings/,
		breadcrumbs: () => {
			return [
				{
					href: "/home",
					text: "Return Home",
				},
			];
		},
		icon: <ReturnIcon size="20" />,
	},
];

export const settingsGeneralMenuItems: HierarchicalMenuItem[] = [
	{
		pageUrlReg: /^\/settings\/general\/sign-up$/,
		breadcrumbs: () => {
			return [
				{
					href: "/settings/general/sign-up",
					text: "Sign Up",
				},
			];
		},
	},
	{
		pageUrlReg: /^\/settings\/general\/roles$/,
		breadcrumbs: () => {
			return [
				{
					href: "/settings/general/roles",
					text: "Roles",
				},
			];
		},
	},
	{
		pageUrlReg: /^\/settings\/general\/appearance$/,
		breadcrumbs: () => {
			return [
				{
					href: "/settings/general/appearance",
					text: "Appearance",
				},
			];
		},
	},
];

export const settingsMyAccountMenuItems: HierarchicalMenuItem[] = [
	{
		pageUrlReg: /^\/settings\/my-account\/profile$/,
		breadcrumbs: () => {
			return [
				{
					href: "/settings/my-account/profile",
					text: "Profile",
				},
			];
		},
	},
];

export const menu = homeMenuItem
	.concat(menuItems)
	.concat(settingsReturnMenuItem)
	.concat(settingsGeneralMenuItems)
	.concat(settingsMyAccountMenuItems);
