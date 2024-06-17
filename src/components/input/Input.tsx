import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

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
				{isRequired && <span className="text-red-400">*</span>}
				{isInvalid && (
					<div className="ml-2 text-red-400">{errorMessage}</div>
				)}
			</div>
			<input
				ref={ref}
				{...rest}
				className={`w-full p-[10px] m-[2px] 
				text-base
				${isInvalid && "text-red-400"}
				bg-neutral-100
				caret-neutral-600
				${isInvalid && "border-solid border-red-400 border-2 m-0"}
				rounded
				outline-none`}
			>
				{children}
			</input>
		</div>
	);
});
