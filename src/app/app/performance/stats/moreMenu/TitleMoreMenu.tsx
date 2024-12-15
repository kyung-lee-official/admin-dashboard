import { useCallback, useEffect, useRef, useState } from "react";
import { EditIcon, MoreIcon } from "@/components/icons/Icons";
import { createPortal } from "react-dom";
import { EditPanel, EditProps } from "@/components/edit-panel/EditPanel";

export const TitleMoreMenu = () => {
	const [edit, setEdit] = useState<EditProps>({ show: false, id: "" });

	const [show, setShow] = useState(false);
	const entryRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleClick = useCallback((e: any) => {
		if (entryRef.current) {
			if (
				e.target === entryRef.current ||
				entryRef.current.contains(e.target)
			) {
				/* entry clicked */
				setShow((state) => {
					return !state;
				});
			} else {
				if (menuRef.current) {
					/* menu clicked */
					if (
						menuRef.current.contains(e.target) ||
						menuRef.current.contains(e.target)
					) {
						/* do nothing or hide menu, up to you */
						// setShow(false);
					} else {
						/* outside clicked */
						setShow(false);
					}
				}
			}
		}
	}, []);

	useEffect(() => {
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, []);

	return (
		<div className="relative w-fit">
			<button
				ref={entryRef}
				className="flex justify-center items-center w-7 h-7
				text-white/50
				hover:bg-white/10 rounded-md"
			>
				<MoreIcon size={15} />
			</button>
			{show && (
				<div
					ref={menuRef}
					className="absolute top-9 right-0
					flex flex-col min-w-52 p-1
					text-sm
					bg-neutral-800
					rounded-md shadow-md border-[1px] border-white/10 border-t-white/15"
				>
					<button
						className="flex items-center px-2 py-1.5 gap-2
						whitespace-nowrap"
						onClick={() => {
							setEdit({
								show: true,
								id: "add-stat",
							});
							setShow(false);
						}}
					>
						<div className="text-white/40">
							<EditIcon size={15} />
						</div>
						Add a stat
					</button>
				</div>
			)}
			{createPortal(
				<EditPanel edit={edit} setEdit={setEdit} />,
				document.body
			)}
		</div>
	);
};
