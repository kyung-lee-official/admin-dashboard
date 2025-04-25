type SortState = {
	column: "date" | "priceCny";
	direction: "asc" | "desc";
};

type Action = { type: "SORT_BY_DATE" } | { type: "SORT_BY_PRICE_CNY" };

export const timePriceSortReducer = (
	state: SortState,
	action: Action
): SortState => {
	switch (action.type) {
		case "SORT_BY_DATE":
			return {
				column: "date",
				direction:
					state.column === "date" && state.direction === "asc"
						? "desc"
						: "asc",
			};
		case "SORT_BY_PRICE_CNY":
			return {
				column: "priceCny",
				direction:
					state.column === "priceCny" && state.direction === "asc"
						? "desc"
						: "asc",
			};
		default:
			return state;
	}
};
