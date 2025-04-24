import { cloneElement, ReactElement, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

type ConfirmDialogWithButtonProps<T> = {
	/* restrict children to button elements */
	children: ReactElement<HTMLButtonElement>;
	question: string;
	description?: string;
	confirmText?: string;
	data?: T;
	onOk: (data: T | undefined) => void;
};

export const ConfirmDialogWithButton = <T,>({
	children,
	question,
	description,
	confirmText = "Confirm",
	data,
	onOk,
}: ConfirmDialogWithButtonProps<T>) => {
	const [show, setShow] = useState(false);

	return (
		<>
			{/* Clone the button and attach the onClick handler */}
			{cloneElement(children as ReactElement<any>, {
				onClick: () => setShow(true),
			})}

			{/* Confirmation dialog */}
			<ConfirmDialog
				show={show}
				setShow={setShow}
				question={question}
				description={description}
				confirmText={confirmText}
				data={data}
				onOk={onOk}
			/>
		</>
	);
};
