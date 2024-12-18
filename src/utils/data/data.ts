/**
 * Removes duplicates from an array
 * @param array the array to remove duplicates from
 * @returns the array without duplicates
 */
export function uniq(array: any[]) {
	return array.filter((value, index, self) => self.indexOf(value) === index);
}

/* get all string keys of an object */
export type StringKeys<T> = {
	[K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

/**
 * sort by property
 * @param arr the arr to sort
 * @param k the property key to sort by
 */
export function sortByProp<T, K extends StringKeys<T>>(arr: T[], k: K) {
	return arr.sort((a: T, b: T) => String(a[k]).localeCompare(String(b[k])));
}
