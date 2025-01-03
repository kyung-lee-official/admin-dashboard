interface TypeMap {
	/* for mapping from strings to types */
	string: string;
	number: number;
	boolean: boolean;
}
/*  'string' | 'number' | 'boolean' | constructor */
type PrimitiveOrConstructor = { new (...args: any[]): any } | keyof TypeMap;
/* infer the guarded type from a specific case of PrimitiveOrConstructor */
type GuardedType<T extends PrimitiveOrConstructor> = T extends {
	new (...args: any[]): infer U;
}
	? U
	: T extends keyof TypeMap
	? TypeMap[T]
	: never;

export function typeGuard<T extends PrimitiveOrConstructor>(
	o: unknown,
	className: T
): o is GuardedType<T> {
	const localPrimitiveOrConstructor: PrimitiveOrConstructor = className;
	if (typeof localPrimitiveOrConstructor === "string") {
		return typeof o === localPrimitiveOrConstructor;
	}
	return o instanceof localPrimitiveOrConstructor;
}
