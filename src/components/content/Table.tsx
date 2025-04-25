import { ReactNode } from "react";

export const Table = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<table
			className="w-full
			text-sm text-white/50"
		>
			{children}
		</table>
	);
};

export const Thead = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<thead
			className="sticky top-0 
			[&_>_tr_>_th]:py-3 [&_>_tr_>_th]:px-6
			[&_>_tr_>_th]:text-left font-semibold
			[&_>_tr_>_th]:border-t-[1px] [&_>_tr_>_th]:border-white/10
			bg-neutral-800"
		>
			{children}
		</thead>
	);
};

export const Tbody = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<tbody
			className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
			[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10
			[&_>_tr]:hover:bg-white/5"
		>
			{children}
		</tbody>
	);
};
