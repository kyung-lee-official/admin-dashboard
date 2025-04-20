import { DateRange } from "@/components/date/date-range-picker/DateRangePicker";

export type Sku = {
	id: number;
	sku: string;
	nameZhCn: string;
};

export type KanbanFilterState = {
	dateRange: DateRange;
	clients: string[];
	storehouses: string[];
	categories: string[];
	skus: Sku | Sku[] | null;
};

export type KanbanFilterAction =
	| { type: "SET_DATE_RANGE"; payload: DateRange }
	| { type: "SET_CLIENTS"; payload: string[] }
	| { type: "SET_STOREHOUSES"; payload: string[] }
	| { type: "SET_CATEGORIES"; payload: string[] }
	| { type: "SET_SKUS"; payload: Sku | Sku[] | null };

export function kanbanFilterReducer(
	state: KanbanFilterState,
	action: KanbanFilterAction
) {
	switch (action.type) {
		case "SET_DATE_RANGE":
			return { ...state, dateRange: action.payload };
		case "SET_CLIENTS":
			return { ...state, clients: action.payload };
		case "SET_STOREHOUSES":
			return { ...state, storehouses: action.payload };
		case "SET_CATEGORIES":
			return { ...state, categories: action.payload };
		case "SET_SKUS":
			return { ...state, skus: action.payload };
		default:
			return state;
	}
}
