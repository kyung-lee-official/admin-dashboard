import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getMembers, MembersQK } from "@/utils/api/members";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth";
import { EditRoleData } from "./EditContentEditRole";
import { sortByMemberName } from "./data";
import { Member } from "@/utils/types/internal";

const Checkbox = (props: { checked: boolean }) => {
	const { checked } = props;

	return checked ? (
		<div className={"text-blue-500 rounded overflow-hidden"}>
			<CheckSquareFillIcon />
		</div>
	) : (
		<div
			className="w-4 h-4 
			bg-slate-200 
			border-2 border-neutral-300
			rounded"
		></div>
	);
};

const CheckSquareFillIcon = () => {
	return (
		<svg
			viewBox="0 0 16 16"
			height={"16px"}
			width={"16px"}
			focusable="false"
			role="img"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"></path>
		</svg>
	);
};

export const EditMembers = (props: {
	newData: EditRoleData;
	setNewData: Dispatch<SetStateAction<EditRoleData>>;
}) => {
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

	const [sortedAllMembers, setSortedAllMembers] = useState<Member[]>([]);

	useEffect(() => {
		if (membersQuery.isSuccess) {
			setSortedAllMembers(sortByMemberName(membersQuery.data));
		}
	}, [membersQuery.data]);

	const { newData, setNewData } = props;

	return (
		<ul
			className="flex flex-col justify-start items-start w-full h-fit max-h-40 gap-1.5 px-2 py-1.5
			bg-white/10 rounded-md scrollbar
			border-[1px] border-white/10 overscroll-y-auto"
		>
			{sortedAllMembers.length &&
				sortedAllMembers.map((member: any) => {
					const checked = newData.members.some(
						(m: Member) => m.id === member.id
					);

					return (
						<li className="w-full" key={member.id}>
							<button
								className="flex items-center w-full p-1 gap-2
								hover:bg-white/5 rounded select-none"
								onClick={(e) => {
									e.preventDefault();
									if (checked) {
										setNewData({
											id: newData.id,
											name: newData.name,
											members: newData.members.filter(
												(newDataMember: Member) =>
													member.id !==
													newDataMember.id
											),
										});
									} else {
										setNewData({
											id: newData.id,
											name: newData.name,
											members: sortByMemberName([
												...newData.members,
												member,
											]),
										});
									}
								}}
							>
								<Checkbox checked={checked} />
								<div>{member.name}</div>
							</button>
						</li>
					);
				})}
		</ul>
	);
};
