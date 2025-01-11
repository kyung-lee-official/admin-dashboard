/* get all keys of string properties of an object */
export type StringKeys<T> = {
	[K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

/**
 * sort by property
 * @param arr the arr to sort
 * @param k the property key to sort by
 */
export function sortByProp<T>(arr: T[], k: StringKeys<T>) {
	return arr.sort((a: T, b: T) => String(a[k]).localeCompare(String(b[k])));
}
