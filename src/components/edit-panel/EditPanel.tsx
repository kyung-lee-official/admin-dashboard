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
import { EditContentAddTemplate } from "@/app/app/performance/event-templates/edit-content-add-template/EditContentAddTemplate";
import { EditContentOverwriteSourceData } from "@/app/app/sns-crawler/facebook-group/source-data/edit-content-overwrite-source-data/EditContentOverwriteSourceData";
import { EditContentOverwriteYouTubeSourceData } from "@/app/app/sns-crawler/youtube-data-collector/source-data/edit-content-overwrite-youtube-source-data/EditContentOverwriteYouTubeSourceData";
import { EditContentAddYouTubeToken } from "@/app/app/sns-crawler/youtube-data-collector/manage-token/edit-content-add-youtube-token/EditContentAddYouTubeToken";
import EditContentAddMember from "@/app/settings/general/members/EditContentAddMember";
import { EditContentAddSection } from "@/app/app/performance/stats/[statId]/edit-content-add-section/EditContentAddSection";
import { EditContentEditSection } from "@/app/app/performance/stats/[statId]/section/[sectionId]/edit-content-edit-section/EditContentEditSection";

export enum EditId {
	/* settings */
	SIGN_UP = "sign-up",
	ADD_ROLE = "add-role",
	EDIT_ROLE = "edit-role",
	ADD_MEMBER = "add-member",
	PROFILE = "profile",
	AVATAR = "avatar",
	EMAIL = "email",
	CHANGE_PASSWORD = "change-password",
	/* app/performance */
	ADD_STAT = "add-stat",
	ADD_SECTION = "add-section",
	EDIT_SECTION = "edit-section",
	ADD_TEMPLATE = "add-template",
	/* app/sns-crawler */
	OVERWRITE_FACEBOOK_GROUP_SOURCE_DATA = "overwrite-facebook-group-source-data",
	EDIT_FACEBOOK_GROUP_SOURCE_DATA = "edit-facebook-group-source-data",
	ADD_YOUTUBE_TOKEN = "add-youtube-token",
	OVERWRITE_YOUTUBE_SOURCE_DATA = "overwrite-youtube-source-data",
}

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
		case EditId.SIGN_UP:
			return <EditContentSignUp edit={edit} setEdit={setEdit} />;
		case EditId.ADD_ROLE:
			return <EditContentAddRole edit={edit} setEdit={setEdit} />;
		case EditId.EDIT_ROLE:
			return <EditContentEditRole edit={edit} setEdit={setEdit} />;
		case EditId.ADD_MEMBER:
			return <EditContentAddMember edit={edit} setEdit={setEdit} />;
		case EditId.PROFILE:
			return <EditContentProfile edit={edit} setEdit={setEdit} />;
		case EditId.AVATAR:
			return <EditContentAvatar edit={edit} setEdit={setEdit} />;
		case EditId.EMAIL:
			return <EditContentEmail edit={edit} setEdit={setEdit} />;
		case EditId.CHANGE_PASSWORD:
			return <EditContentPassword edit={edit} setEdit={setEdit} />;
		case EditId.ADD_STAT:
			return <EditContentAddStat edit={edit} setEdit={setEdit} />;
		case EditId.ADD_SECTION:
			return <EditContentAddSection edit={edit} setEdit={setEdit} />;
		case EditId.EDIT_SECTION:
			return <EditContentEditSection edit={edit} setEdit={setEdit} />;
		case EditId.ADD_TEMPLATE:
			return <EditContentAddTemplate edit={edit} setEdit={setEdit} />;
		case EditId.OVERWRITE_FACEBOOK_GROUP_SOURCE_DATA:
			return (
				<EditContentOverwriteSourceData edit={edit} setEdit={setEdit} />
			);
		case EditId.EDIT_FACEBOOK_GROUP_SOURCE_DATA:
			return null;
		case EditId.ADD_YOUTUBE_TOKEN:
			return <EditContentAddYouTubeToken edit={edit} setEdit={setEdit} />;
		case EditId.OVERWRITE_YOUTUBE_SOURCE_DATA:
			return (
				<EditContentOverwriteYouTubeSourceData
					edit={edit}
					setEdit={setEdit}
				/>
			);
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
