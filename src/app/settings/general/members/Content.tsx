"use client";

import { Exception } from "@/components/page-authorization/Exception";
import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getMembers, MembersQK } from "@/utils/api/members";
import { Member } from "@/utils/types/internal";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const Content = () => {
	const jwt = useAuthStore((state) => state.jwt);

	const membersQuery = useQuery<Member[], AxiosError>({
		queryKey: [MembersQK.GET_MEMBERS],
		queryFn: async () => {
			const members = await getMembers(jwt);
			return members;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (membersQuery.isPending) {
		return <Loading />;
	}

	if (membersQuery.isSuccess && membersQuery.data) {
		return (
			<div>
				{membersQuery.data.map((m, i) => {
					return <div key={i}>{m.name}</div>;
				})}
			</div>
		);
	} else {
		return <Exception />;
	}
};
