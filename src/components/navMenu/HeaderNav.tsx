import { useParams, usePathname } from "next/navigation";
import { flattenMenu } from "./MenuItems";
import Link from "next/link";
import { menu } from "./MenuItems";
import { ArrowRight } from "./ArrowRight";

export const HeaderNav = () => {
	const flattenedMenu = flattenMenu(menu);

	const pathname = usePathname();
	const params = useParams();
	const { statId, sectionId, eventId, templateId, taskId, keywordId } =
		params;

	const item = flattenedMenu.find((item) => {
		return item.pageUrlReg.test(pathname);
	});

	if (item) {
		const crumbs = item.breadcrumbs({
			statId,
			sectionId,
			eventId,
			templateId,
			taskId,
			keywordId,
		});
		return (
			<nav
				className="h-[56px] flex items-center p-3
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
