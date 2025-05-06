type SortState = {
	column: string;
	direction: "asc" | "desc";
};

type Action = {
	type: "SORT_BY_COLUMN";
	payload: string; // Column name to sort by
};

export const productSalesVolumeReducer = (
	state: SortState,
	action: Action
): SortState => {
	switch (action.type) {
		case "SORT_BY_COLUMN":
			return {
				column: action.payload,
				direction:
					state.column === action.payload && state.direction === "asc"
						? "desc"
						: "asc" /* Toggle direction if the same column is clicked */,
			};
		default:
			return state;
	}
};
