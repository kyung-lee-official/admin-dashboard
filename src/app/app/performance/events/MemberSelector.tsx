import { sortByMemberName } from "@/app/settings/general/roles/edit-content-edit-role/data";
import { Member } from "@/utils/types/internal";
import { SearchOutlineIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import { getMembers } from "@/utils/api/members";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
	useState,
	useRef,
	useCallback,
	useEffect,
	Dispatch,
	SetStateAction,
} from "react";

type MemberSelectorProps = {
	member: Member | undefined;
	setMember: Dispatch<SetStateAction<Member | undefined>>;
};

export const MemberSelector = (props: MemberSelectorProps) => {
	const [show, setShow] = useState<boolean>(false);

	const entryRef = useRef<HTMLInputElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleClick = useCallback((e: any) => {
		if (entryRef.current) {
			if (
				e.target === entryRef.current ||
				entryRef.current.contains(e.target)
			) {
				/* entry clicked */
				setShow((state) => {
					return !state;
				});
			} else {
				if (menuRef.current) {
					/* menu clicked */
					if (
						e.target === menuRef.current ||
						menuRef.current.contains(e.target)
					) {
						/* do nothing or hide menu, up to you */
						// setShow(false);
					} else {
						/* outside clicked */
						setShow(false);
					}
				}
			}
		}
	}, []);

	useEffect(() => {
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, []);

	const jwt = useAuthStore((state) => state.jwt);

	const membersQuery = useQuery<Member[], AxiosError>({
		queryKey: ["get-members", jwt],
		queryFn: async () => {
			const members = await getMembers(jwt);
			return members;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const { member, setMember } = props;

	return (
		<div
			className="relative flex items-center
			text-white/50"
		>
			<input
				ref={entryRef}
				type="text"
				value={member ? `${member.name} (${member.email})` : ""}
				title={member ? `${member.name} (${member.email})` : ""}
				className="px-2 py-1
				text-sm
				bg-white/10
				border-solid border-l-[1px] border-y-[1px] border-white/10
				rounded-l-md outline-none whitespace-nowrap text-ellipsis"
				onChange={() => {}}
			/>
			<div
				className="flex justify-center items-center h-[30px] px-1
				bg-white/10
				border-solid border-r-[1px] border-y-[1px] border-white/10
				rounded-r-md"
			>
				<SearchOutlineIcon size={20} />
			</div>
			{show && membersQuery.data && (
				<div
					ref={menuRef}
					className="absolute top-10
					flex flex-col
					bg-neutral-800
					rounded-md shadow-lg border-[1px] border-white/10 border-t-white/15"
				>
					{sortByMemberName(membersQuery.data).map((m, i) => {
						return (
							<button
								key={m.id}
								className="p-2 text-nowrap"
								onClick={() => {
									setMember(m);
									setShow(false);
								}}
							>
								{m.name} ({m.email})
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};
