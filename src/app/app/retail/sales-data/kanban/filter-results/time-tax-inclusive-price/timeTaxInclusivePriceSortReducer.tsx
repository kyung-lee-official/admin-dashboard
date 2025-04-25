type SortState = {
	column: "date" | "taxInclusivePriceCny";
	direction: "asc" | "desc";
};

type Action =
	| { type: "SORT_BY_DATE" }
	| { type: "SORT_BY_TAX_INCLUSIVE_PRICE_CNY" };

export const timeTaxInclusivePriceSortReducer = (
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
