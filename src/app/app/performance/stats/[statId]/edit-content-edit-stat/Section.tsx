import { EditSectionData } from "@/utils/types/app/performance";
import { Dispatch, SetStateAction } from "react";
import { EditSectionAction, EditSectionType } from "./Reducers";
import { Button } from "@/components/button/Button";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import { MemberRole } from "@/utils/types/internal";
import { AxiosError } from "axios";
import { getAllRoles, RolesQK } from "@/utils/api/roles";
import { Dropdown } from "@/components/input/dropdown/Dropdown";
import { IntegerInput } from "@/components/input/integer-input/IntegerInput";

export const Section = (props: {
	s: EditSectionData;
	dispatchStatSections: Dispatch<EditSectionAction>;
	setDeleteTempId: Dispatch<SetStateAction<string>>;
	setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>;
}) => {
	const { s, dispatchStatSections, setDeleteTempId, setShowDeleteConfirm } =
		props;

	const jwt = useAuthStore((state) => state.jwt);
	const rolesQuery = useQuery<MemberRole[], AxiosError>({
		queryKey: [RolesQK.GET_ALL_ROLES],
		queryFn: async () => {
			const roles = await getAllRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	function setRole(role: MemberRole) {
		dispatchStatSections({
			type: EditSectionType.UPDATE_MEMBER_ROLE,
			payload: {
				tempId: s.tempId,
				memberRoleId: role.id,
			},
		});
	}

	return (
		<div
			className="flex flex-col
			border-[1px] border-white/20 border-t-white/30
			rounded"
		>
			<div
				className="flex flex-wrap justify-between items-center px-2 py-1 gap-y-1.5
				bg-white/5"
			>
				<input
					type="text"
					className="w-40 px-2 py-0.5
					bg-transparent
					border-[1px] border-white/20 border-t-white/30
					rounded"
					value={s.title}
					onChange={(e) => {
						const title = e.target.value;
						dispatchStatSections({
							type: EditSectionType.UPDATE_TITLE,
							payload: {
								tempId: s.tempId,
								title,
							},
						});
					}}
				/>
				<div className="flex items-center gap-2">
					<div>Weight</div>
					<IntegerInput
						value={s.weight}
						onChange={(v: number) => {
							const weight = v;
							dispatchStatSections({
								type: EditSectionType.UPDATE_WEIGHT,
								payload: {
									tempId: s.tempId,
									weight,
								},
							});
						}}
					/>
				</div>
				<Button
					size="sm"
					onClick={(e) => {
						e.preventDefault();
						/* check whether the section is new or not */
						if (s.id) {
							/* if the section is not new, ask for confirmation */
							setDeleteTempId(s.tempId);
							setShowDeleteConfirm(true);
						} else {
							/* if the section is new, remove it immediately */
							dispatchStatSections({
								type: EditSectionType.DELETE,
								payload: {
									tempId: s.tempId,
								},
							});
						}
					}}
				>
					Delete
				</Button>
				{rolesQuery.data && (
					<Dropdown
						kind="object"
						mode="search"
						selected={
							rolesQuery.data.find((role) => {
								return role.id === s.memberRoleId;
							}) as MemberRole | MemberRole[] | null
						}
						setSelected={
							setRole as Dispatch<
								SetStateAction<MemberRole | MemberRole[] | null>
							>
						}
						options={rolesQuery.data ?? []}
						placeholder="Select a role"
						label={{ primaryKey: "name", secondaryKey: "id" }}
						sortBy="name"
					/>
				)}
				{/* For debug only */}
				{/* <div>{s.tempId}</div> */}
			</div>
			<textarea
				placeholder={"Description"}
				className="p-2
				bg-transparent
				border-t-[1px] border-white/20
				outline-none"
				value={s.description || ""}
				onChange={(e) => {
					const description = e.target.value;
					dispatchStatSections({
						type: EditSectionType.UPDATE_DESCRIPTION,
						payload: {
							tempId: s.tempId,
							description,
						},
					});
				}}
			/>
		</div>
	);
};
