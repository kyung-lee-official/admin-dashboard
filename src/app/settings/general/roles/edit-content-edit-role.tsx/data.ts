import { Member } from "./EditContentEditRole";

/**
 * sort by member name
 */
export function sortByMemberName(members: Member[]) {
	return members.sort((a: any, b: any) => a.name.localeCompare(b.name));
}
