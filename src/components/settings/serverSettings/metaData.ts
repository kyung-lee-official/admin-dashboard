import { Groups } from "./pages/Groups/Groups";
import { Members } from "./pages/Members";
import { Overview } from "./pages/Overview";
import { Roles } from "./pages/Roles/Roles";
import { Server } from "./pages/Server";

export const metaData = [
	{
		heading: "SERVER SETTINGS",
		items: [
			{
				name: "Overview",
				path: "/serverSettings/overview",
				component: Overview,
			},
			{
				name: "Server",
				path: "/serverSettings/server",
				component: Server,
			},
		],
	},
	{
		heading: "USER MANAGEMENT",
		items: [
			{
				name: "Roles",
				path: "/userManagement/roles",
				component: Roles,
			},
			{
				name: "Groups",
				path: "/userManagement/groups",
				component: Groups,
			},
			{
				name: "Members",
				path: "/userManagement/members",
				component: Members,
			},
		],
	},
];
