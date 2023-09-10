"use client";

import { useEffect, useState } from "react";
import { Sacl, SaclContext, SaclStatusType } from "..";
import { publicRoutes } from "./publicRoutes";
import { usePathname } from "next/navigation";
import { Theme, useThemeStore } from "@/stores/theme";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/utilities/react-query/react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const AppWrapper = ({ children }: any) => {
	const [saclStatus, setSaclStatus] = useState<SaclStatusType>(
		"isSeededQuery.isLoading"
	);
	const pathname = usePathname();
	const isPublicRoute = publicRoutes.includes(pathname);

	const theme = useThemeStore((state) => state.theme);
	useEffect(() => {
		const className = "dark";
		const bodyClass = window.document.body.classList;
		if (theme === Theme.DARK) {
			bodyClass.add(className);
		} else {
			bodyClass.remove(className);
		}
	}, [theme]);

	return (
		<QueryClientProvider client={queryClient}>
			<div className="bg-gray-400 dark:bg-gray-700">
				{isPublicRoute ? (
					<div className="min-h-screen">{children}</div>
				) : (
					<SaclContext.Provider value={{ saclStatus, setSaclStatus }}>
						<Sacl>{children}</Sacl>
					</SaclContext.Provider>
				)}
			</div>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default AppWrapper;
