import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { EditIcon, MoreIcon, DeleteIcon } from "@/components/icons/Icons";
import { EditProps } from "@/components/edit-panel/EditPanel";
import { DeleteConfirmDialog } from "@/components/delete-confirmation/DeleteConfirmDialog";
import { useMutation } from "@tanstack/react-query";
import { deleteStatById } from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { useAuthStore } from "@/stores/auth";

type ItemMoreMenuProps = {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
};

export const ItemMoreMenu = (props: ItemMoreMenuProps) => {
	const { edit, setEdit } = props;
	const { statId } = edit.auxData;
	const { jwt } = useAuthStore();

	const [show, setShow] = useState(false);
	const entryRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

	const mutation = useMutation({
		mutationFn: () => {
			return deleteStatById(parseInt(statId), jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-stats", jwt],
			});
			setShow(false);
		},
		onError: () => {},
	});

	function onDelete() {
		mutation.mutate();
	}

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
					text-sm text-white/90
					bg-neutral-800
					rounded-md shadow-md border-[1px] border-white/10 border-t-white/15
					z-20"
				>
					<button
						className="flex items-center px-2 py-1.5 gap-2
						hover:bg-white/5
						rounded whitespace-nowrap"
						onClick={() => {
							setEdit({
								show: true,
								id: "edit-role",
								auxData: edit.auxData,
							});
							setShow(false);
						}}
					>
						<div className="text-white/40">
							<EditIcon size={15} />
						</div>
						Edit Role
					</button>
					<hr className="-m-1 my-1 border-white/10" />
					<button
						className="flex items-center px-2 py-1.5 gap-2
						hover:bg-white/5
						rounded whitespace-nowrap"
						onClick={() => {
							setShow(false);
							setShowDeleteConfirmation(true);
						}}
					>
						<div className="text-white/40">
							<DeleteIcon size={15} />
						</div>
						Remove Role
					</button>
				</div>
			)}
			<DeleteConfirmDialog
				show={showDeleteConfirmation}
				setShow={setShowDeleteConfirmation}
				question={"Are you sure you want to delete this stat?"}
				onDelete={onDelete}
			/>
		</div>
	);
};
