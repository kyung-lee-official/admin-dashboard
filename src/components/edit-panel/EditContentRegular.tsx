import { Button } from "@/components/button/Button";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { ConfirmDialog } from "../confirm-dialog/ConfirmDialog";
import { CloseIcon } from "@/components/icons/Icons";
import { motion } from "framer-motion";
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";

export const EditContentRegular = (props: {
	children: ReactNode;
	title: string;
	editId: EditId;
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
	onSave: Function;
	newData: any;
	oldData: any;
}) => {
	const { children, title, editId, edit, setEdit, onSave, newData, oldData } =
		props;

	const listenerRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	const [isChanged, setIsChanged] = useState(false);
	const isChangedRef = useRef(isChanged);
	const _setIsChanged = (data: any) => {
		isChangedRef.current = data;
		setIsChanged(data);
	};
	const [showUnsaved, setShowUnsaved] = useState(false);

	function quit() {
		if (isChangedRef.current) {
			setShowUnsaved(true);
		} else {
			setEdit({ show: false, id: editId });
		}
	}

	useEffect(() => {
		if (newData && JSON.stringify(newData) !== JSON.stringify(oldData)) {
			_setIsChanged(true);
		} else {
			_setIsChanged(false);
		}
	}, [newData]);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (!listenerRef.current) {
				return;
			}
			if (listenerRef.current === event.target) {
				quit();
			}
		}
		listenerRef.current?.addEventListener("mousedown", handleClickOutside);
		return () => {
			listenerRef.current?.removeEventListener(
				"mousedown",
				handleClickOutside
			);
		};
	}, [isChanged]);

	return (
		<div
			ref={listenerRef}
			className="w-full h-svh
			flex justify-end items-center"
		>
			<motion.div
				ref={panelRef}
				initial={{ x: "100%" }}
				animate={{ x: "0%" }}
				transition={{ duration: 0.1 }}
				className="absolute top-2 bottom-2 right-2 w-full max-w-[560px]
				text-white/90
				bg-neutral-900
				rounded-lg border-[1px] border-neutral-700 border-t-neutral-600"
			>
				<div className="relative w-full h-full">
					<div
						className="absolute top-0 w-full h-[61px]
						flex justify-between px-6 py-4
						font-semibold text-lg
						border-b-[1px] border-white/10"
					>
						<div>{title}</div>
						<button
							className="flex justify-center items-center w-7 h-7
							text-white/50
							hover:bg-white/10 rounded-md"
							onClick={() => {
								quit();
							}}
						>
							<CloseIcon size={15} />
						</button>
					</div>
					<div
						className="absolute top-[61px] bottom-[61px] w-full
						overflow-y-auto scrollbar"
					>
						{children}
					</div>
					<div
						className="absolute bottom-0 w-full h-[61px]
						flex justify-between px-6 py-4 gap-1.5
						border-t-[1px] border-white/10"
					>
						<Button
							color="cancel"
							size="sm"
							onClick={(e) => {
								e.preventDefault();
								quit();
							}}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							onClick={(e) => {
								e.preventDefault();
								onSave();
							}}
						>
							Save
						</Button>
					</div>
				</div>
			</motion.div>
			<ConfirmDialog
				show={showUnsaved}
				setShow={setShowUnsaved}
				question="Are you sure you want to leave?"
				confirmText="Continue"
				onOk={() => {
					setEdit({ show: false, id: edit.id });
				}}
			/>
		</div>
	);
};
