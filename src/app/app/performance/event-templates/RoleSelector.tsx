import { MemberRole } from "@/utils/types/internal";
import { SearchOutlineIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
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
import { getAllRoles, RolesQK } from "@/utils/api/roles";
import { sortByProp } from "@/utils/data/data";

type RoleSelectorProps = {
	role: MemberRole | undefined;
	setRole: Dispatch<SetStateAction<MemberRole | undefined>>;
};

export const RoleSelector = (props: RoleSelectorProps) => {
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

	const rolesQuery = useQuery<MemberRole[], AxiosError>({
		queryKey: [RolesQK.GET_ALL_ROLES, jwt],
		queryFn: async () => {
			const roles = await getAllRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const { role, setRole } = props;

	return (
		<div
			className="relative flex items-center
			text-white/50"
		>
			<input
				ref={entryRef}
				type="text"
				value={role ? `${role.name} (${role.id})` : ""}
				title={role ? `${role.name} (${role.id})` : ""}
				placeholder="Select a role"
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
			{show && rolesQuery.data && (
				<div
					ref={menuRef}
					className="absolute top-10
					flex flex-col
					bg-neutral-800
					rounded-md shadow-lg border-[1px] border-white/10 border-t-white/15"
				>
					{sortByProp(rolesQuery.data, "name").map(
						(r: MemberRole, i: number) => {
							return (
								<button
									key={r.id}
									className="flex w-full p-2
									text-nowrap"
									onClick={() => {
										setRole(r);
										setShow(false);
									}}
								>
									{r.name} ({r.id})
								</button>
							);
						}
					)}
				</div>
			)}
		</div>
	);
};
