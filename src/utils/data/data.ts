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
 * @param arr the arr to sort
 * @param k the property key to sort by
 */
export function sortByProp<T>(arr: T[], k: keyof T) {
	return arr.sort((a: T, b: T) => String(a[k]).localeCompare(String(b[k])));
}
