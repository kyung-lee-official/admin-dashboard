import { useParams } from "next/navigation";
import { HierarchicalMenuItem, MenuKey } from "./MenuItems";
import Link from "next/link";

export const HeaderNav = (props: {
	item: HierarchicalMenuItem | undefined;
}) => {
	const { item } = props;

	const params = useParams();
	const { statId, sectionId, eventId } = params;

	if (item?.breadcrumbs) {
		switch (item.menuKey) {
			case MenuKey.PERFORMANCE_STAT:
				return (
					<nav
						className="flex-[0_0_56px] flex items-center p-3
						text-sm font-semibold dark:text-white/40
						border-b-[1px] dark:border-white/5"
					>
						<item.breadcrumbs statId={statId} />
					</nav>
				);
			case MenuKey.PERFORMANCE_SECTION:
				return (
					<nav
						className="flex-[0_0_56px] flex items-center p-3
							text-sm font-semibold dark:text-white/40
							border-b-[1px] dark:border-white/5"
					>
						<item.breadcrumbs
							statId={statId}
							sectionId={sectionId}
						/>
					</nav>
				);
			case MenuKey.PERFORMANCE_EVENT:
				return (
					<nav
						className="flex-[0_0_56px] flex items-center p-3
							text-sm font-semibold dark:text-white/40
							border-b-[1px] dark:border-white/5"
					>
						<item.breadcrumbs
							statId={statId}
							sectionId={sectionId}
							eventId={eventId}
						/>
					</nav>
				);
			default:
				break;
		}
	}

	return (
		<nav
			className="flex-[0_0_56px] flex items-center p-3
			text-sm font-semibold dark:text-white/40
			border-b-[1px] dark:border-white/5"
		>
			{item?.title && item?.link && (
				<Link href={item.link}>{item.title}</Link>
			)}
		</nav>
	);
};
