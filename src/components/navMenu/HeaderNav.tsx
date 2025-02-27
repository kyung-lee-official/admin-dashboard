import { useParams, usePathname } from "next/navigation";
import { HierarchicalMenuItem } from "./MenuItems";
import Link from "next/link";
import { menu } from "./MenuItems";
import { ArrowRight } from "./ArrowRight";

export const HeaderNav = () => {
	function flattenMenu(
		menuItems: HierarchicalMenuItem[]
	): HierarchicalMenuItem[] {
		const flatList: HierarchicalMenuItem[] = [];
		function traverse(items: HierarchicalMenuItem[]) {
			for (const item of items) {
				/* add the current item to the flat list */
				flatList.push(item);
				/* if the item has a submenu, recursively flatten it */
				if (item.subMenu && item.subMenu.length > 0) {
					traverse(item.subMenu);
				}
			}
		}
		traverse(menuItems);
		return flatList;
	}
	const flattenedMenu = flattenMenu(menu);

	const pathname = usePathname();
	const params = useParams();
	const { statId, sectionId, eventId, templateId, taskId } = params;

	const item = flattenedMenu.find((item) => {
		if (item.pageUrlReg.test(pathname)) {
			/* check the regex source, ensure it ends with '$' so that it matches the end of the pathname */
			if (item.pageUrlReg.source.endsWith("$")) {
				return item.pageUrlReg.test(pathname);
			}
		}
	});

	if (item) {
		const crumbs = item.breadcrumbs({ statId, sectionId, eventId });
		return (
			<nav
				className="flex-[0_0_56px] flex items-center p-3
				text-sm font-semibold dark:text-white/40
				border-b-[1px] dark:border-white/5"
			>
				<div className="flex items-center gap-2 flex-wrap">
					{crumbs.map((crumb, index) => {
						if (index === crumbs.length - 1) {
							return (
								<Link
									key={index}
									href={crumb.href}
									className="text-neutral-200"
								>
									{crumb.text}
								</Link>
							);
						} else {
							return (
								<div
									key={index}
									className="flex items-center gap-2 flex-wrap"
								>
									<Link
										href={crumb.href}
										className="text-neutral-200"
									>
										{crumb.text}
									</Link>
									<ArrowRight size={15} />
								</div>
							);
						}
					})}
				</div>
			</nav>
		);
	}
};
