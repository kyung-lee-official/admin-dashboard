export function scale(
	number: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number
) {
	return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function clamp(number: number, min: number, max: number) {
	return Math.min(Math.max(number, min), max);
}
