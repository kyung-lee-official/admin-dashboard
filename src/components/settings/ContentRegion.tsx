import { CloseIcon } from "..";

export const SettingsHeading = (props: any) => {
	const { children } = props;
	return (
		<h1 className="text-xl text-gray-600 font-mono font-bold">
			{children}
		</h1>
	);
};

export const SettingsSubHeading = (props: any) => {
	const { children } = props;
	return <h2 className="text-xs text-gray-500 font-bold my-2">{children}</h2>;
};

export const ContentRegion = (props: any) => {
	const { metaData, setShowSettings, activePath } = props;
	const flattenItems = metaData.map((section: any) => section.items).flat();
	const activeItem = flattenItems.find(
		(page: any) => page.path === activePath
	);

	return (
		<div
			className="flex-[6_0_740px] flex justify-start h-screen
			bg-white dark:bg-gray-700
			overflow-auto scrollbar"
		>
			<div className="relative w-[740px] px-10">
				<div className="h-12" />
				<activeItem.component />
				<div className="h-12" />
			</div>
			<div
				className="sticky top-12 right-0 h-12 w-12 flex justify-center items-center
				text-gray-500"
			>
				<div
					className="cursor-pointer"
					onClick={() => {
						setShowSettings(false);
					}}
				>
					<CloseIcon />
				</div>
			</div>
		</div>
	);
};
