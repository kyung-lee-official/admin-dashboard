import { Appearance, MyAccount } from "./pages";

export const metaData = [
	{
		heading: "USER SETTINGS",
		items: [
			{
				name: "My Account",
				path: "/userSettings/myAccount",
				component: MyAccount,
			},
		],
	},
	{
		heading: "APP SETTINGS",
		items: [
			{
				name: "Appearance",
				path: "/appSettings/appearance",
				component: Appearance,
			},
		],
	},
];
