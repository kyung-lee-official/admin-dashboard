type SortState = {
	column: "storehouses" | "salesVolume";
	direction: "asc" | "desc";
};

type Action =
	| { type: "SORT_BY_STOREHOUSES" }
	| { type: "SORT_BY_SALES_VOLUME" };

export const storehousesSalesVolumeReducer = (
	state: SortState,
	action: Action
): SortState => {
	switch (action.type) {
		case "SORT_BY_STOREHOUSES":
			return {
				column: "storehouses",
				direction:
					state.column === "storehouses" && state.direction === "asc"
						? "desc"
						: "asc",
			};
		case "SORT_BY_SALES_VOLUME":
			return {
				column: "salesVolume",
				direction:
					state.column === "salesVolume" && state.direction === "asc"
						? "desc"
						: "asc",
			};
		default:
			return state;
	}
};
