/**
 * Removes duplicates from an array
 * @param array the array to remove duplicates from
 * @returns the array without duplicates
 */
export function uniq(array: any[]) {
	return array.filter((value, index, self) => self.indexOf(value) === index);
}

/**
 * sort by property
 * @param object the object to sort
 * @param prop the property to sort by
 */
export function sortByProp(object: any, prop: string) {
	return object.sort((a: any, b: any) => a[prop].localeCompare(b[prop]));
}
