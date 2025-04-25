type SortState = {
	column: "clients" | "priceCny";
	direction: "asc" | "desc";
};

type Action = { type: "SORT_BY_CLIENTS" } | { type: "SORT_BY_PRICE_CNY" };

export const clientsPriceReducer = (
	state: SortState,
	action: Action
): SortState => {
	switch (action.type) {
		case "SORT_BY_CLIENTS":
			return {
				column: "clients",
				direction:
					state.column === "clients" && state.direction === "asc"
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
