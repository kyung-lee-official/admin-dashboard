import { forwardRef, InputHTMLAttributes } from "react";

type InputProps = {
	isInvalid: boolean;
	errorMessage?: string;
};

export const Input = forwardRef<
	HTMLInputElement,
	InputHTMLAttributes<HTMLInputElement> & InputProps
>(function Input({ children, isInvalid, errorMessage, ...rest }, ref) {
	return (
		<div>
			<input
				ref={ref}
				{...rest}
				className={`w-full p-[10px]
				text-base
				${isInvalid && "text-red-400"}
				bg-neutral-100
				caret-neutral-600
				${isInvalid && "border-solid border-red-400 border-2"}
				rounded
				outline-none`}
			>
				{children}
			</input>
			{isInvalid && (
				<div
					className="text-base text-red-400 font-bold"
					// initial={{
					// 	opacity: 0,
					// 	scaleY: 0,
					// 	height: "0rem",
					// 	originY: 0,
					// }}
					// animate={{
					// 	opacity: 1,
					// 	scaleY: 1,
					// 	height: "1rem",
					// }}
					// exit={{
					// 	opacity: 0,
					// 	scaleY: 0,
					// 	height: "0rem",
					// 	originY: 0,
					// }}
				>
					{errorMessage}
				</div>
			)}
		</div>
	);
});
