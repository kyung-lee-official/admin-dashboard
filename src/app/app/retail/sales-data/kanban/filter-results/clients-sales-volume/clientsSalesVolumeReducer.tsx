type SortState = {
	column: "clients" | "salesVolume";
	direction: "asc" | "desc";
};

type Action = { type: "SORT_BY_CLIENTS" } | { type: "SORT_BY_SALES_VOLUME" };

export const clientsSalesVolumeReducer = (
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
