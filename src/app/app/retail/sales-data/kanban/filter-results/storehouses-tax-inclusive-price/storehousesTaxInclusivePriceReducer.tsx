type SortState = {
	column: "storehouses" | "taxInclusivePriceCny";
	direction: "asc" | "desc";
};

type Action =
	| { type: "SORT_BY_STOREHOUSES" }
	| { type: "SORT_BY_SALES_VOLUME" };

export const storehousesTaxInclusivePriceReducer = (
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
				column: "taxInclusivePriceCny",
				direction:
					state.column === "taxInclusivePriceCny" &&
					state.direction === "asc"
						? "desc"
						: "asc",
			};
		default:
			return state;
	}
};
