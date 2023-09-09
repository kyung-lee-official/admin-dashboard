import { motion } from "framer-motion";
import { Button } from "..";

export const SettingsChangedIndicator = (props: any) => {
	const { onReset, onSave, isLoading } = props;
	return (
		<motion.div
			className="fixed flex bottom-6 left-0 w-full"
			key={"settings-changed-indicator"}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
		>
			<div className="flex-[4_0_220px]"></div>
			<div className="flex-[6_0_740px]">
				<div className="w-[740px] flex justify-center">
					<div
						className="flex justify-between items-center w-11/12 h-12 px-3
						text-gray-800 bg-white
						text-base font-normal
						shadow-[0_2px_10px_rgba(0,0,0,0.2)] rounded-md"
					>
						<span>Careful — you have unsaved changes!</span>
						<div className="flex items-center gap-6">
							<div className="cursor-pointer" onClick={onReset}>
								Reset
							</div>
							<Button
								onClick={onSave}
								isLoading={isLoading}
								buttonType="settings"
							>
								<div className="font-semibold">Save Changes</div>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};
