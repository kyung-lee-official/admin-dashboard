"use client";

import { CopyIcon, EditIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import { getMyInfo, MembersQK } from "@/utils/api/members";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { OneRowSkeleton } from "@/components/skeleton/OneRowSkeleton";
import { MyAvatar } from "./edit-content-avatar/MyAvatar";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
import { MemberRole } from "@/utils/types/internal";

export type MyInfo = {
	id: string;
	email: string;
	name: string;
	isVerified: boolean;
	isFrozen: boolean;
	memberRoles: MemberRole[];
};

export const Content = () => {
	const jwt = useAuthStore((state) => state.jwt);

	const myInfoQuery = useQuery<MyInfo, AxiosError>({
		queryKey: [MembersQK.GET_MY_INFO, jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.PROFILE,
	});

	if (myInfoQuery.data) {
		return (
			<PageContainer>
				<PageBlock title="Profile">
					<Table>
						<Tbody>
							<tr>
								<td className="w-1/2">
									<MyAvatar />
								</td>
								<td className="w-1/2">
									<div className="w-7 h-7">
										{/* placeholder */}
									</div>
								</td>
								<td>
									<button
										className="flex justify-center items-center w-7 h-7
										text-white/50
										hover:bg-white/10 rounded-md"
										onClick={() => {
											setEdit({
												show: true,
												id: EditId.AVATAR,
											});
										}}
									>
										<EditIcon size={15} />
									</button>
								</td>
							</tr>
							<tr>
								<td className="w-1/2">Name</td>
								<td className="w-1/2">
									{myInfoQuery.isSuccess ? (
										myInfoQuery.data.name
									) : (
										<OneRowSkeleton />
									)}
								</td>
								<td>
									<button
										className="flex justify-center items-center w-7 h-7
										text-white/50
										hover:bg-white/10 rounded-md"
										onClick={() => {
											setEdit({
												show: true,
												id: EditId.PROFILE,
											});
										}}
									>
										<EditIcon size={15} />
									</button>
								</td>
							</tr>
							<tr>
								<td>ID</td>
								<td>
									{myInfoQuery.isSuccess ? (
										myInfoQuery.data.id
									) : (
										<OneRowSkeleton />
									)}
								</td>
								<td>
									<div className="w-7 h-7">
										<button
											className="flex justify-center items-center w-7 h-7
											text-white/50
											hover:bg-white/10 rounded-md"
											onClick={() => {
												navigator.clipboard.writeText(
													myInfoQuery.data.id
												);
											}}
										>
											<CopyIcon size={15} />
										</button>
									</div>
								</td>
							</tr>
							<tr>
								<td>Roles</td>
								<td>
									<div className="flex gap-1.5">
										{myInfoQuery.isSuccess ? (
											myInfoQuery.data.memberRoles.map(
												(role: any) => (
													<div
														key={role.id}
														className="px-1
														rounded border-[1px] border-white/20"
													>
														{role.name}
													</div>
												)
											)
										) : (
											<OneRowSkeleton />
										)}
									</div>
								</td>
								<td>
									<div className="w-7 h-7">
										{/* placeholder */}
									</div>
								</td>
							</tr>
						</Tbody>
					</Table>
				</PageBlock>
				<PageBlock title="Security">
					<Table>
						<Tbody>
							<tr>
								<td className="w-1/2">Email</td>
								<td className="w-1/2">
									{myInfoQuery.isSuccess ? (
										<div className="flex items-center gap-2">
											<div>{myInfoQuery.data.email}</div>
											<div>
												{myInfoQuery.data
													.isVerified ? null : (
													<div
														className="px-1
														border-[1px] border-white/20 rounded"
													>
														Unverified
													</div>
												)}
											</div>
										</div>
									) : (
										<OneRowSkeleton />
									)}
								</td>
								<td>
									<button
										className="flex justify-center items-center w-7 h-7
										text-white/50
										hover:bg-white/10 rounded-md"
										onClick={() => {
											setEdit({
												show: true,
												id: EditId.EMAIL,
											});
										}}
									>
										<EditIcon size={15} />
									</button>
								</td>
							</tr>
							<tr>
								<td>Change Password</td>
								<td>{/* placeholder */}</td>
								<td>
									<button
										className="flex justify-center items-center w-7 h-7
										text-white/50
										hover:bg-white/10 rounded-md"
										onClick={() => {
											setEdit({
												show: true,
												id: EditId.CHANGE_PASSWORD,
											});
										}}
									>
										<EditIcon size={15} />
									</button>
								</td>
							</tr>
						</Tbody>
					</Table>
				</PageBlock>
				{createPortal(
					<EditPanel edit={edit} setEdit={setEdit} />,
					document.body
				)}
			</PageContainer>
		);
	} else {
		return null;
	}
};
