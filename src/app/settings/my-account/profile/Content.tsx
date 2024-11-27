"use client";

import { CopyIcon, EditIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import { getMyInfo } from "@/utils/api/members";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";
import { EditPanel, EditProps } from "../../EditPanel";
import { OneRowSkeleton } from "@/components/skeleton/OneRowSkeleton";
import { MyAvatar } from "./edit-content-avatar/MyAvatar";

export const Content = () => {
	const jwt = useAuthStore((state) => state.jwt);

	const myInfoQuery = useQuery<any, AxiosError>({
		queryKey: ["my-info", jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const [edit, setEdit] = useState<EditProps>({ show: false, id: "" });

	return (
		<div className="flex flex-col w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				rounded-md border-[1px] border-white/10 border-t-white/15"
			>
				<div className="flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Profile</div>
				</div>
				<table className="text-sm text-white/50 font-semibold">
					<tbody
						className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
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
										setEdit({ show: true, id: "avatar" });
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
										setEdit({ show: true, id: "profile" });
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
					</tbody>
				</table>
			</div>
			<div
				className="text-white/90
				bg-white/5
				rounded-md border-[1px] border-white/10 border-t-white/15"
			>
				<div className="flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Security</div>
				</div>
				<table className="text-sm text-white/50 font-semibold">
					<tbody
						className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
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
										setEdit({ show: true, id: "email" });
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
											id: "change-password",
										});
									}}
								>
									<EditIcon size={15} />
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			{createPortal(
				<EditPanel edit={edit} setEdit={setEdit} />,
				document.body
			)}
		</div>
	);
};
