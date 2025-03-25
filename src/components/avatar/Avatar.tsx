"use client";

import { useAuthStore } from "@/stores/auth";
import { downloadAvatar } from "@/utils/api/members";
import { Member } from "@/utils/types/internal";
import { useEffect, useState } from "react";

export const Avatar = (props: { member: Member; className?: string }) => {
	const { member, className } = props;
	const jwt = useAuthStore((state) => state.jwt);
	const [avatar, setAvatar] = useState<Blob | null>(null);

	useEffect(() => {
		const getAvatar = async () => {
			const avatar = await downloadAvatar(member.id, jwt);
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
					text-neutral-100 text-lg select-none"
				>
					{member.name[0]}
				</div>
			)}
		</div>
	);
};
