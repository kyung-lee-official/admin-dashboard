import { ChangeEventHandler, ReactNode } from "react";

export const EditContentRegularForm = (props: { children: ReactNode }) => {
	const { children } = props;
	return <form className="flex flex-col px-6 py-4 gap-6">{children}</form>;
};

export const EditContentRegularFormBlock = (props: {
	title: string | ReactNode;
	children: ReactNode;
}) => {
	const { title, children } = props;
	return (
		<div className="flex flex-col gap-1.5 text-sm">
			<div>{title}</div>
			<div>{children}</div>
		</div>
	);
};
