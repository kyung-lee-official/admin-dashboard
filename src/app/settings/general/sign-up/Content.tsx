"use client";

import { EditIcon } from "@/components/icons/Icons";
import { useState } from "react";
import { EditPanel, EditProps } from "../../EditPanel";
import { createPortal } from "react-dom";

export const Content = () => {
	const [edit, setEdit] = useState<EditProps>({ show: false, id: "" });

	return (
		<div className="w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				rounded-md border-[1px] border-white/10 border-t-white/15"
			>
				<div className="flex justify-between items-center px-6 py-4">
					<div className="text-lg font-semibold">Sign Up</div>
					<button
						className="flex justify-center items-center w-7 h-7
						text-white/50
						hover:bg-white/10 rounded-md"
						onClick={() => {
							setEdit({ show: true, id: "sign-up" });
						}}
					>
						<EditIcon size={15} />
					</button>
				</div>
			</div>
			{createPortal(
				<EditPanel edit={edit} setEdit={setEdit} />,
				document.body
			)}
		</div>
	);
};
