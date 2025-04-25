type SortState = {
	column: "clients" | "taxInclusivePriceCny";
	direction: "asc" | "desc";
};

type Action =
	| { type: "SORT_BY_CLIENTS" }
	| { type: "SORT_BY_TAX_INCLUSIVE_PRICE_CNY" };

export const clientsTaxInclusivePriceCnyReducer = (
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
		case "SORT_BY_TAX_INCLUSIVE_PRICE_CNY":
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
