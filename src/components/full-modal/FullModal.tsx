import { motion } from "motion/react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { PageContainer } from "../content/PageContainer";

const DarkenMask = (props: {
	setShow: Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
}) => {
	const { setShow, children } = props;
	return (
		<motion.div
			initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
			animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
			className="absolute top-0 right-0 bottom-0 left-0 z-5
			overflow-hidden"
			onClick={(e) => {
				setShow(false);
			}}
		>
			{children}
		</motion.div>
	);
};

const Window = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<div
			className="absolute top-8 right-8 bottom-8 left-8 p-6
			bg-neutral-900 
			rounded shadow"
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<PageContainer>{children}</PageContainer>
		</div>
	);
};

export const FullModal = (props: {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
}) => {
	const { show, setShow, children } = props;
	if (!show) {
		return null;
	}
	return (
		<DarkenMask setShow={setShow}>
			<Window>{children}</Window>
		</DarkenMask>
	);
};
