import { DateRange } from "@/components/date/date-range-picker/DateRangePicker";
import dayjs from "dayjs";
import { z } from "zod";

export const skuSchema = z.object({
	id: z.number(),
	sku: z.string(),
	nameZhCn: z.string(),
});

export type Sku = z.infer<typeof skuSchema>;

const SharedkanbanFilterStateSchema = z.object({
	clients: z.array(z.string()),
	storehouses: z.array(z.string()),
	categories: z.array(z.string()),
	receiptTypes: z.array(z.string()),
	sourceAttributes: z.array(z.string()),
	skus: z.union([skuSchema, z.array(skuSchema), z.null()]),
});

export const kanbanFilterStateSchema = z.discriminatedUnion("dateMode", [
	z
		.object({
			dateMode: z.literal("range"),
			dateRange: z.object({
				start: z.custom<dayjs.Dayjs>(),
				end: z.custom<dayjs.Dayjs>(),
			}),
		})
		.merge(SharedkanbanFilterStateSchema),
	z
		.object({
			dateMode: z.literal("month"),
			/* restrict to 0-11 */
			months: z.array(z.number().int().min(0).max(11)),
		})
		.merge(SharedkanbanFilterStateSchema),
]);

export type KanbanFilterState = z.infer<typeof kanbanFilterStateSchema>;

export type KanbanFilterAction =
	| { type: "SET_DATE_RANGE"; payload: DateRange }
	| { type: "SET_CLIENTS"; payload: string[] }
	| { type: "SET_STOREHOUSES"; payload: string[] }
	| { type: "SET_CATEGORIES"; payload: string[] }
	| { type: "SET_RECEIPT_TYPES"; payload: string[] }
	| { type: "SET_SOURCE_ATTRIBUTES"; payload: string[] }
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
		case "SET_RECEIPT_TYPES":
			return { ...state, receiptTypes: action.payload };
		case "SET_SOURCE_ATTRIBUTES":
			return { ...state, sourceAttributes: action.payload };
		case "SET_SKUS":
			return { ...state, skus: action.payload };
		default:
			return state;
	}
}
