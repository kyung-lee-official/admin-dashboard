type SortState = {
	column: "product" | "salesVolume";
	direction: "asc" | "desc";
};

type Action =
	| { type: "SORT_BY_PRODUCT" }
	| { type: "SORT_BY_SALES_VOLUME" };

export const productSalesVolumeReducer = (
	state: SortState,
	action: Action
): SortState => {
	switch (action.type) {
		case "SORT_BY_PRODUCT":
			return {
				column: "product",
				direction:
					state.column === "product" && state.direction === "asc"
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
