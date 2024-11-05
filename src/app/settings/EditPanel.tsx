import { motion } from "framer-motion";
import { EditContent } from "./general/sign-up/EditContent";
import { Dispatch, SetStateAction } from "react";
import { EditProps } from "./general/sign-up/Content";

export const EditPanel = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const { edit, setEdit } = props;

	if (edit.show) {
		return (
			/* darken mask */
			<motion.div
				initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
				animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
				className="absolute top-0 right-0 bottom-0 left-0 z-10
				flex justify-end
				overflow-hidden"
			>
				<EditContent setEdit={setEdit} />
			</motion.div>
		);
	} else {
		return null;
	}
};
