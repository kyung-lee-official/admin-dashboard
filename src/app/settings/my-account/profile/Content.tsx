"use client";

import { EditIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import { getMyInfo } from "@/utils/api/members";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
// import { EditPanel } from "../../EditPanel";
import { createPortal } from "react-dom";
import { EditPanel } from "../../EditPanel";
import { OneRowSkeleton } from "@/components/skeleton/OneRowSkeleton";

export type EditProps = {
	show: boolean;
	id: string;
};

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
		<div className="flex flex-col w-full max-w-[1600px] p-3 gap-y-3">
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
									text-white/50"
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
									{/* placeholder */}
								</div>
							</td>
						</tr>
						<tr>
							<td>Roles</td>
							<td>
								{myInfoQuery.isSuccess ? (
									myInfoQuery.data.memberRoles.map(
										(role: any) => role.name
									)
								) : (
									<OneRowSkeleton />
								)}
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
									myInfoQuery.data.email
								) : (
									<OneRowSkeleton />
								)}
							</td>
							<td>
								<button
									className="flex justify-center items-center w-7 h-7
									text-white/50"
									onClick={() => {
										setEdit({ show: true, id: "sign-up" });
									}}
								>
									<EditIcon size={15} />
								</button>
							</td>
						</tr>
						<tr>
							<td>Change Password</td>
							<td>
								{/* <Toggle
									isOn={newData?.allowGoogleSignIn}
									isAllowed={true}
									onClick={() => {
										setNewData({
											...newData,
											allowGoogleSignIn:
												!newData.allowGoogleSignIn,
										});
									}}
								/> */}
							</td>
							<td>
								<button
									className="flex justify-center items-center w-7 h-7
									text-white/50"
									onClick={() => {
										setEdit({ show: true, id: "sign-up" });
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
