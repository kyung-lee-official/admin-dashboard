import {
	Dispatch,
	forwardRef,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { MoreIcon } from "../../../../../components/icons/Icons";

type MoreMenuProps = {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
};

export const MoreMenu = forwardRef(function MoreMenu(
	props: MoreMenuProps,
	ref
) {
	const { show, setShow } = props;
	const entryRef = ref as React.MutableRefObject<HTMLButtonElement>;
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
					flex flex-col p-1
					bg-neutral-800
					rounded-md shadow-md border-[1px] border-white/10 border-t-white/15"
				>
					<button className="px-2 py-1.5">Keep</button>
					<button
						className="px-2 py-1.5"
						onClick={() => {
							setShow(false);
						}}
					>
						Hide
					</button>
				</div>
			)}
		</div>
	);
});
