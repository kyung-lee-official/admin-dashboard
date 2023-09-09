import { useAuthStore } from "@/stores/auth";
import { downloadAvatar } from "@/utilities/api/api";
import React, { useEffect, useState } from "react";

export const Avatar = (props: { user: any; className?: string }) => {
	const { user, className } = props;
	const accessToken = useAuthStore((state) => state.accessToken);
	const [avatar, setAvatar] = useState<Blob | null>(null);

	useEffect(() => {
		const getAvatar = async () => {
			const avatar = await downloadAvatar(user.id, accessToken);
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
					{user.nickname[0]}
				</div>
			)}
		</div>
	);
};
