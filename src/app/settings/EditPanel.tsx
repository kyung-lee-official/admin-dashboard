import { motion } from "framer-motion";
import { EditContentSignUp } from "./general/sign-up/EditContentSignUp";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { EditProps } from "./general/sign-up/Content";
import { EditContentProfile } from "./my-account/profile/EditContentProfile";

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
			default:
				return null;
		}
	} else {
		return null;
	}
};
