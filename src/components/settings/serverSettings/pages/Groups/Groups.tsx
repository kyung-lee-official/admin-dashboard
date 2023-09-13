"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { getGroups } from "@/utilities/api/api";
import { Main } from "./Main";
import { Edit } from "./Edit";

export const Groups = () => {
	const [page, setPage] = useState<"main" | "edit" | "error">("main");
	const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
	const { accessToken } = useAuthStore();

	const groupsQuery = useQuery<any, AxiosError>({
		queryKey: ["getGroups", accessToken],
		queryFn: async () => {
			const groups = await getGroups(accessToken);
			return groups;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (groupsQuery.status === "success") {
			if (groupsQuery.data.length > 0) {
				setActiveGroupId(groupsQuery.data[0].id);
			}
		}
	}, [groupsQuery.status]);

	if (page === "main") {
		return (
			<Main
				groupsQuery={groupsQuery}
				setPage={setPage}
				setActiveGroupId={setActiveGroupId}
				accessToken={accessToken}
			/>
		);
	} else if (page === "edit") {
		return (
			<Edit
				groupsQuery={groupsQuery}
				setPage={setPage}
				activeGroupId={activeGroupId}
				setActiveGroupId={setActiveGroupId}
				accessToken={accessToken}
			/>
		);
	} else {
		/* page is "error" */
	}
};
