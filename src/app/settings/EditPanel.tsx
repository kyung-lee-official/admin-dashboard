import { motion } from "framer-motion";
import { EditContentSignUp } from "./general/sign-up/EditContentSignUp";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { EditContentProfile } from "./my-account/profile/EditContentProfile";
import { EditContentEmail } from "./my-account/profile/EditContentEmail";
import { EditContentPassword } from "./my-account/profile/EditContentPassword";

type EditId = "" | "sign-up" | "profile" | "email" | "change-password";

export type EditProps = {
	show: boolean;
	id: EditId;
};

const DarkenMask = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<motion.div
			initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
			animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
			className="absolute top-0 right-0 bottom-0 left-0 z-10
			flex justify-end
			overflow-hidden"
		>
			{children}
		</motion.div>
	);
};

export const EditPanel = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const { edit, setEdit } = props;

	if (edit.show) {
		switch (edit.id) {
			case "sign-up":
				return (
					<DarkenMask>
						<EditContentSignUp setEdit={setEdit} />
					</DarkenMask>
				);
			case "profile":
				return (
					<DarkenMask>
						<EditContentProfile setEdit={setEdit} />
					</DarkenMask>
				);
			case "email":
				return (
					<DarkenMask>
						<EditContentEmail setEdit={setEdit} />
					</DarkenMask>
				);
			case "change-password":
				return (
					<DarkenMask>
						<EditContentPassword setEdit={setEdit} />
					</DarkenMask>
				);
			default:
				return null;
		}
	} else {
		return null;
	}
};
