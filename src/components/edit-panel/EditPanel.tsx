import { motion } from "framer-motion";
import { EditContentSignUp } from "../../app/settings/general/sign-up/EditContentSignUp";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { EditContentProfile } from "../../app/settings/my-account/profile/EditContentProfile";
import { EditContentEmail } from "../../app/settings/my-account/profile/EditContentEmail";
import { EditContentPassword } from "../../app/settings/my-account/profile/EditContentPassword";
import { EditContentAvatar } from "../../app/settings/my-account/profile/edit-content-avatar/EditContentAvatar";
import { EditContentAddRole } from "../../app/settings/general/roles/EditContentAddRole";
import { EditContentEditRole } from "../../app/settings/general/roles/edit-content-edit-role/EditContentEditRole";
import { EditContentAddStat } from "@/app/app/performance/stats/edit-content-add-stat/EditContentAddStat";

type EditId =
	/* settings */
	| ""
	| "sign-up"
	| "add-role"
	| "edit-role"
	| "profile"
	| "avatar"
	| "email"
	| "change-password"
	/* app/performance */
	| "add-stat";

export type EditProps = {
	show: boolean;
	id: EditId;
	auxData?: any;
};

const DarkenMask = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<motion.div
			initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
			animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
			className="absolute top-0 right-0 bottom-0 left-0 z-10
			overflow-hidden"
		>
			{children}
		</motion.div>
	);
};

const EditContent = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const { edit, setEdit } = props;
	switch (edit.id) {
		case "sign-up":
			return <EditContentSignUp edit={edit} setEdit={setEdit} />;
		case "add-role":
			return <EditContentAddRole edit={edit} setEdit={setEdit} />;
		case "edit-role":
			return <EditContentEditRole edit={edit} setEdit={setEdit} />;
		case "profile":
			return <EditContentProfile edit={edit} setEdit={setEdit} />;
		case "avatar":
			return <EditContentAvatar edit={edit} setEdit={setEdit} />;
		case "email":
			return <EditContentEmail edit={edit} setEdit={setEdit} />;
		case "change-password":
			return <EditContentPassword edit={edit} setEdit={setEdit} />;
		case "add-stat":
			return <EditContentAddStat edit={edit} setEdit={setEdit} />;
		default:
			return null;
	}
};

export const EditPanel = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const { edit, setEdit } = props;
	if (edit.show) {
		return (
			<DarkenMask>
				<EditContent edit={edit} setEdit={setEdit} />
			</DarkenMask>
		);
	} else {
		return null;
	}
};
