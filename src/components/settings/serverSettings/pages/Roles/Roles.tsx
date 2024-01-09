"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "./Edit";
import { Main } from "./Main";
import { getRoles } from "@/utils/api/roles";

export const Roles = () => {
	const [page, setPage] = useState<"main" | "edit" | "error">("main");
	const [activeRoleId, setActiveRoleId] = useState<number | null>(null);
	const { accessToken } = useAuthStore();

	const rolesQuery = useQuery<any, AxiosError>({
		queryKey: ["getRoles", accessToken],
		queryFn: async () => {
			const roles = await getRoles(accessToken);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (rolesQuery.status === "success") {
			if (rolesQuery.data.length > 0) {
				setActiveRoleId(rolesQuery.data[0].id);
			}
		}
	}, [rolesQuery.status]);

	if (page === "main") {
		return (
			<Main
				rolesQuery={rolesQuery}
				setPage={setPage}
				setActiveRoleId={setActiveRoleId}
				accessToken={accessToken}
			/>
		);
	} else if (page === "edit") {
		return (
			<Edit
				rolesQuery={rolesQuery}
				setPage={setPage}
				activeRoleId={activeRoleId}
				setActiveRoleId={setActiveRoleId}
				accessToken={accessToken}
			/>
		);
	} else {
		/* page is "error" */
	}
};
