import { Button } from "@/components/button/Button";

export const Attachments = () => {
	return (
		<div
			className="text-white/50
			bg-white/5
			border-[1px] border-white/10 border-t-white/15
			rounded-md"
		>
			<div className="flex justify-between items-center w-full px-6 py-4">
				<div>Attachments</div>
				<Button size="sm">Upload</Button>
			</div>
			<div
				className="min-h-28 px-6 py-3
				border-t-[1px] border-white/10"
			></div>
		</div>
	);
};
