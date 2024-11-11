import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type State = {
	jwt: string;
	tencentCosTempCredential: any;
};

type Action = {
	setJwt: (newAccessToken: string | null) => void;
	setTencentCosTempCredential: (newTencentCosTempCredential: any) => void;
};

export const useAuthStore = create<State & Action>()(
	devtools(
		persist(
			(set) => ({
				jwt: "",
				setJwt: (newAccessToken) => {
					return set((state) => {
						if (newAccessToken) {
							return { jwt: `Bearer ${newAccessToken}` };
						} else {
							return { jwt: undefined };
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
