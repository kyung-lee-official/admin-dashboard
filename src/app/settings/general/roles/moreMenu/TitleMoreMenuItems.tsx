import { useState } from "react";
import { EditIcon } from "@/components/icons/Icons";
import { createPortal } from "react-dom";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";

export const TitleMoreMenuItems = () => {
	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.ADD_ROLE,
	});

	return (
		<>
			<TitleMoreMenu
				items={[
					{
						text: "Add a role",
						hideMenuOnClick: true,
						icon: <EditIcon size={15} />,
						onClick: () => {
							setEdit({
								show: true,
								id: EditId.ADD_ROLE,
							});
						},
					},
				]}
			/>
			{createPortal(
				<EditPanel edit={edit} setEdit={setEdit} />,
				document.body
			)}
		</>
	);
};
