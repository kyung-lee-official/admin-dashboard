import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { Button } from "../button/Button";

export const ConfirmDialog = (props: {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
	question: string;
	description?: string;
	confirmText?: string;
	onOk: MouseEventHandler<HTMLButtonElement>;
}) => {
	const {
		show,
		setShow,
		question,
		description,
		confirmText = "Confirm",
		onOk,
	} = props;

	if (show) {
		return (
			<div
				className="fixed top-0 right-0 bottom-0 left-0
				bg-black/50 flex justify-center items-center
				z-30"
			>
				<div
					className="w-full max-w-[400px] mx-auto
					text-white/90
					bg-neutral-800
					border-[1px] border-white/10
					shadow-lg rounded-md backdrop:bg-black/50 outline-none"
				>
					<div className="flex flex-col pt-6 px-6 gap-1.5">
						<div className="font-semibold">{question}</div>
						<div className="text-sm text-white/50">
							{description}
						</div>
					</div>
					<div
						className="flex justify-end p-6 gap-1.5
						leading-4"
					>
						<Button
							color="cancel"
							size="sm"
							onClick={() => {
								setShow(false);
							}}
						>
							Cancel
						</Button>
						<Button size="sm" onClick={onOk}>
							{confirmText}
						</Button>
					</div>
				</div>
			</div>
		);
	} else {
		return null;
	}
};
