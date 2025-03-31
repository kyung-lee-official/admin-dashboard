import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/input/dropdown/Dropdown";
import { IntegerInput } from "@/components/input/integer-input/IntegerInput";
import { useAuthStore } from "@/stores/auth";
import { getAllRoles, RolesQK } from "@/utils/api/roles";
import { CreateSectionData } from "@/utils/types/app/performance";
import { MemberRole } from "@/utils/types/internal";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const Section = (props: {
	s: CreateSectionData;
	sections: CreateSectionData[];
	setSections: Dispatch<SetStateAction<CreateSectionData[]>>;
}) => {
	const { s, sections, setSections } = props;
	const [role, setRole] = useState<MemberRole | undefined>(undefined);

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

	useEffect(() => {
		setSections(
			sections.map((section) => {
				if (s.tempId === section.tempId) {
					return {
						tempId: s.tempId,
						weight: s.weight,
						memberRoleId: role?.id ?? null,
						title: s.title,
						description: s.description,
						createdAt: s.createdAt,
					};
				}
				return section;
			})
		);
	}, [role]);

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
					border-[1px] border-neutral-700 border-t-neutral-600
					rounded"
					placeholder="Title"
					value={s.title}
					onChange={(e) => {
						setSections(
							sections.map((section) => {
								if (s.tempId === section.tempId) {
									const title = e.target.value;
									return {
										tempId: s.tempId,
										weight: s.weight,
										memberRoleId: s.memberRoleId,
										title: title,
										description: s.description,
										createdAt: s.createdAt,
									};
								}
								return section;
							})
						);
					}}
				/>
				<div className="flex items-center gap-2">
					<div>Weight</div>
					<IntegerInput
						min={0}
						max={100}
						value={s.weight}
						onChange={(v: number) => {
							setSections(
								sections.map((section) => {
									if (s.tempId === section.tempId) {
										const weight = v;
										return {
											tempId: s.tempId,
											weight: Number.isNaN(weight)
												? 0
												: weight,
											memberRoleId: s.memberRoleId,
											title: s.title,
											description: s.description,
											createdAt: s.createdAt,
										};
									}
									return section;
								})
							);
						}}
					/>
				</div>
				<Button
					size="sm"
					onClick={(e) => {
						e.preventDefault();
						setSections(
							sections.filter(
								(section) => s.tempId !== section.tempId
							)
						);
					}}
				>
					Delete
				</Button>
				<Dropdown
					kind="object"
					mode="search"
					selected={role}
					setSelected={setRole}
					options={rolesQuery.data ?? []}
					placeholder="Select a role"
					label={{ primaryKey: "name", secondaryKey: "id" }}
					sortBy="name"
				/>
			</div>
			<textarea
				placeholder={"Description"}
				className="p-2
				bg-transparent
				border-t-[1px] border-white/20
				outline-none"
				value={s.description || ""}
				onChange={(e) => {
					setSections(
						sections.map((section) => {
							if (s.tempId === section.tempId) {
								const description = e.target.value;
								return {
									tempId: s.tempId,
									weight: s.weight,
									memberRoleId: s.memberRoleId,
									title: s.title,
									description: description,
									createdAt: s.createdAt,
								};
							}
							return section;
						})
					);
				}}
			/>
		</div>
	);
};
