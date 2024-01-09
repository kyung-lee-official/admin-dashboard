"use client";

import { useAuthStore } from "@/stores/auth";
import { downloadAvatar } from "@/utils/api/members";
import React, { useEffect, useState } from "react";

export const Avatar = (props: { member: any; className?: string }) => {
	const { member, className } = props;
	const accessToken = useAuthStore((state) => state.accessToken);
	const [avatar, setAvatar] = useState<Blob | null>(null);

	useEffect(() => {
		const getAvatar = async () => {
			const avatar = await downloadAvatar(member.id, accessToken);
			setAvatar(avatar);
		};
		getAvatar();
	}, []);
	return (
		<div className={className}>
			{avatar ? (
				<img
					alt="avatar"
					src={URL.createObjectURL(avatar)}
					className="w-full h-full rounded-full select-none"
				/>
			) : (
				<div
					className="flex justify-center items-center w-full h-full
					text-gray-100 text-lg select-none"
				>
					{member.nickname[0]}
				</div>
			)}
		</div>
	);
};
