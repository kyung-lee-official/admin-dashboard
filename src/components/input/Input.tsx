import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = {
	title?: string;
	isRequired?: boolean;
	/* size, 'size' is a native attribute of the input element, so we can't use it as a prop */
	sz?: "sm" | "md" | "lg";
	isError: boolean;
	errorMessage?: string;
};

export const Input = forwardRef<
	HTMLInputElement,
	InputHTMLAttributes<HTMLInputElement> & InputProps
>(function Input(
	{
		children,
		title,
		isRequired = false,
		sz = "md",
		isError,
		errorMessage,
		...rest
	},
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
				{isError && (
					<div className="ml-2 text-red-400">{errorMessage}</div>
				)}
			</div>
			<input
				ref={ref}
				{...rest}
				className={`w-full py-[6px] px-[8px]
				${sz === "sm" && "text-sm"}
				${isError && "text-red-400"}
				dark:bg-neutral-700/50
				${isError && "border-solid border-red-500 border-[1px] m-0"}
				rounded-lg outline-none`}
			>
				{children}
			</input>
		</div>
	);
});
