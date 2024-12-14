import { useCallback, useEffect, useRef, useState } from "react";
import { DeleteIcon, EditIcon, MoreIcon } from "@/components/icons/Icons";
import { createPortal } from "react-dom";
import { EditPanel, EditProps } from "@/components/edit-panel/EditPanel";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/utils/react-query/react-query";
import { deleteStatById, PerformanceQK } from "@/utils/api/app/performance";
import { useAuthStore } from "@/stores/auth";
import { DeleteConfirmDialog } from "@/components/delete-confirmation/DeleteConfirmDialog";

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

	const params = useParams();
	const statId = parseInt(params.statId as string);
	const jwt = useAuthStore((state) => state.jwt);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const router = useRouter();
	const mutation = useMutation({
		mutationFn: () => {
			return deleteStatById(statId, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_PERFORMANCE_STATS],
			});
			setShow(false);
			router.push("/app/performance/stats");
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
								id: "edit-stat",
								auxData: {
									statId: statId,
								},
							});
							setShow(false);
						}}
					>
						<div className="text-white/40">
							<EditIcon size={15} />
						</div>
						Edit stat
					</button>
					<button
						className="flex items-center px-2 py-1.5 gap-2
						whitespace-nowrap"
						onClick={() => {
							setShow(false);
							setShowDeleteConfirmation(true);
						}}
					>
						<div className="text-white/40">
							<DeleteIcon size={15} />
						</div>
						Delete stat
					</button>
				</div>
			)}
			<DeleteConfirmDialog
				show={showDeleteConfirmation}
				setShow={setShowDeleteConfirmation}
				question={"Are you sure you want to delete this stat?"}
				onDelete={onDelete}
			/>
			{createPortal(
				<EditPanel edit={edit} setEdit={setEdit} />,
				document.body
			)}
		</div>
	);
};
