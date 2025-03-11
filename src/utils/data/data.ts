/**
 * Removes duplicates from an array
 * @param array the array to remove duplicates from
 * @returns the array without duplicates
 */
export function uniq(array: any[]) {
	return array.filter((value, index, self) => self.indexOf(value) === index);
}

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

/**
 * This function chunkify an array into an array of chunks,
 * @example chunkify([1, 2, 3, 4, 5], 2) returns [[1, 2], [3, 4], [5]]
 * @param arr an array to chunkify
 * @param chunkSize chunk size
 * @returns an chunkified array
 */
export function chunkify<T>(arr: T[], chunkSize: number): T[][] {
	if (chunkSize <= 0) {
		throw new Error("Chunk size must be greater than 0.");
	}
	const result: T[][] = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		result.push(arr.slice(i, i + chunkSize));
	}
	return result;
}
