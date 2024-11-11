"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Main } from "./Main";
import { Edit } from "./Edit";
import { getGroups } from "@/utils/api/groups";

export const Groups = () => {
	const [page, setPage] = useState<"main" | "edit" | "error">("main");
	const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
	const { jwt } = useAuthStore();

	const groupsQuery = useQuery<any, AxiosError>({
		queryKey: ["getGroups", jwt],
		queryFn: async () => {
			const groups = await getGroups(jwt);
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
				jwt={jwt}
			/>
		);
	} else if (page === "edit") {
		return (
			<Edit
				groupsQuery={groupsQuery}
				setPage={setPage}
				activeGroupId={activeGroupId}
				setActiveGroupId={setActiveGroupId}
				jwt={jwt}
			/>
		);
	} else {
		/* page is "error" */
	}
};
