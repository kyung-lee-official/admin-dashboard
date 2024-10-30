"use client";

import { useEffect } from "react";
import { publicRoutes } from "./publicRoutes";
import { usePathname } from "next/navigation";
import { Theme, useThemeStore } from "@/stores/theme";
import { queryClient } from "@/utils/react-query/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Sacl } from "../sacl/Sacl";

const AppWrapper = ({ children }: any) => {
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
			<div className="bg-neutral-100 dark:bg-neutral-800">
				{isPublicRoute ? (
					<div className="min-h-[100svh]">{children}</div>
				) : (
					<Sacl>{children}</Sacl>
				)}
			</div>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default AppWrapper;
