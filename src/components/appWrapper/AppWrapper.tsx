import { useState } from "react";
import { Sacl, SaclContext, SaclStatusType } from "..";
import { useRouter } from "next/router";
import { publicRoutes } from "./publicRoutes";

const AppWrapper = ({ children }: any) => {
	const [saclStatus, setSaclStatus] = useState<SaclStatusType>(
		"isSeededQuery.isLoading"
	);
	const router = useRouter();
	const isPublicRoute = publicRoutes.includes(router.pathname);

	return (
		<div className="bg-gray-400 dark:bg-gray-700">
			{isPublicRoute ? (
				<div className="min-h-screen">{children}</div>
			) : (
				<SaclContext.Provider value={{ saclStatus, setSaclStatus }}>
					<Sacl>{children}</Sacl>
				</SaclContext.Provider>
			)}
		</div>
	);
};

export default AppWrapper;
