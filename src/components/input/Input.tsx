import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = {
	title?: string;
	isRequired?: boolean;
	isInvalid: boolean;
	errorMessage?: string;
};

export const Input = forwardRef<
	HTMLInputElement,
	InputHTMLAttributes<HTMLInputElement> & InputProps
>(function Input(
	{ children, title, isRequired = false, isInvalid, errorMessage, ...rest },
	ref
) {
	return (
		<div>
			<div className="flex gap-1">
				{title && (
					<label className="font-bold text-neutral-500">
						{title}
					</label>
				)}
				{isInvalid && (
					<div className="ml-2 text-red-400">{errorMessage}</div>
				)}
			</div>
			<input
				ref={ref}
				{...rest}
				className={`w-full py-[6px] px-[8px]
				${isInvalid && "text-red-400"}
				dark:bg-slate-700/50
				${isInvalid && "border-solid border-red-500 border-[1px] m-0"}
				rounded-lg
				outline-none`}
			>
				{children}
			</input>
		</div>
	);
});
