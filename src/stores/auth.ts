import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type State = {
	jwt: string;
	tencentCosTempCredential: any;
};

type Action = {
	setJwt: (newJwt: string | null) => void;
	setTencentCosTempCredential: (newTencentCosTempCredential: any) => void;
};

export const useAuthStore = create<State & Action>()(
	devtools(
		persist(
			(set) => ({
				jwt: "",
				setJwt: (newJwt) => {
					return set((state) => {
						if (newJwt) {
							return { jwt: `Bearer ${newJwt}` };
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
