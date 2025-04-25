type SortState = {
	column: "date" | "salesVolume";
	direction: "asc" | "desc";
};

type Action = { type: "SORT_BY_DATE" } | { type: "SORT_BY_SALES_VOLUME" };

export const timeSalesVolumeSortReducer = (
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
