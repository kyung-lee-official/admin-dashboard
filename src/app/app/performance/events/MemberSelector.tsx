import { Member } from "@/utils/types/internal";
import { useAuthStore } from "@/stores/auth";
import { getMembers, MembersQK } from "@/utils/api/members";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { SearchInput } from "@/components/input/SearchInput";

type MemberSelectorProps = {
	member: Member | undefined;
	setMember: Dispatch<SetStateAction<Member | undefined>>;
};

export const MemberSelector = (props: MemberSelectorProps) => {
	const jwt = useAuthStore((state) => state.jwt);

	const membersQuery = useQuery<Member[], AxiosError>({
		queryKey: [MembersQK.GET_MEMBERS, jwt],
		queryFn: async () => {
			const members = await getMembers(jwt);
			return members;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const { member, setMember } = props;

	return (
		<SearchInput
			selected={member}
			setSelected={setMember}
			options={membersQuery.data ?? []}
			placeholder="Select a member"
			labelProp={{ primary: "name", secondary: "email" }}
			sortBy="name"
		/>
	);
};
