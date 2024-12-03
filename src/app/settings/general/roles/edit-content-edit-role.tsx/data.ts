/**
 * sort by member name, member must have a 'name' property
 */
export function sortByMemberName(members: any[]) {
	return members.sort((a: any, b: any) => a.name.localeCompare(b.name));
}
