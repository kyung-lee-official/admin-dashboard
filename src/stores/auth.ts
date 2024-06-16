import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type State = {
	accessToken: string | undefined | null;
	tencentCosTempCredential: any;
};

type Action = {
	setAccessToken: (newAccessToken: string | null) => void;
	setTencentCosTempCredential: (newTencentCosTempCredential: any) => void;
};

export const useAuthStore = create<State & Action>()(
	devtools(
		persist(
			(set) => ({
				accessToken: undefined,
				setAccessToken: (newAccessToken) => {
					return set((state) => {
						if (newAccessToken) {
							return { accessToken: `Bearer ${newAccessToken}` };
						} else {
							return { accessToken: undefined };
						}
					});
				},
				tencentCosTempCredential: undefined,
				setTencentCosTempCredential: (newTencentCosTempCredential) => {
					return set((state) => {
						return {
							tencentCosTempCredential:
								newTencentCosTempCredential,
						};
					});
				},
			}),
			{
				name: "token-storage",
			}
		),
		{
			name: "token",
		}
	)
);
