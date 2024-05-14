"use client";

const SidebarSection = (props: any) => {
	const {
		heading,
		items,
		sectionIndex,
		metaData,
		activePath,
		setActivePath,
	} = props;

	return (
		<div className="flex flex-col gap-1 items-start">
			<h1 className="px-2 py-1">{heading}</h1>
			{items.map((item: any, i: number) => {
				return (
					<div
						key={i}
						className={`w-full px-2 py-1
						font-normal text-lg
						${activePath === item.path && "bg-neutral-300"} hover:bg-neutral-200
						rounded-md cursor-pointer`}
						onClick={() => {
							setActivePath(item.path);
						}}
					>
						{item.name}
					</div>
				);
			})}
			{metaData[sectionIndex + 1] && <Divider />}
		</div>
	);
};

const Divider = () => {
	return <div className="w-[90%] h-[1px] mx-auto my-4 bg-slate-300" />;
};

export const SidebarRegion = (props: any) => {
	const { metaData, activePath, setActivePath } = props;

	return (
		<div
			className="flex-[4_0_220px] flex flex-col items-end min-h-screen
			px-6 pt-12
			text-neutral-500
			bg-neutral-100
			font-bold text-lg"
		>
			<div className="w-44">
				{metaData.map((section: any, i: number) => {
					return (
						<SidebarSection
							key={i}
							{...section}
							sectionIndex={i}
							metaData={metaData}
							activePath={activePath}
							setActivePath={setActivePath}
						/>
					);
				})}
			</div>
		</div>
	);
};
