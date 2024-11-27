export const Forbidden = () => {
	return (
		<div className="w-full max-w-[1600px] min-h-[calc(100svh-56px)] p-3 gap-y-3">
			<div
				className="text-white/90
				bg-white/5
				rounded-md border-[1px] border-white/10 border-t-white/15"
			>
				<div className="flex justify-center items-center px-6 py-4">
					<div className="text-lg font-semibold">
						You do not have permission to access this page
					</div>
				</div>
			</div>
		</div>
	);
};
