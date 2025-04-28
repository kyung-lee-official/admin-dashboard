import { z } from "zod";

export const importRetailSalesDataSchema = z.object({
	date: z.string().datetime(),
	receiptType: z.string({ message: "Receipt Type is required" }),
	client: z.string({ message: "Client is required" }),
	department: z.string({ message: "Department is required" }),
	sku: z.string({ message: "SKU is required" }),
	nameZhCn: z.string({ message: "Name is required" }),
	salesVolume: z.number({ message: "Sales Volume is required" }),
	platformAddress: z.string().nullable(),
	platformOrderId: z.string({
		message: "Platform Order ID is required",
	}),
	storehouse: z.string({ message: "Storehouse is required" }),
	category: z.string().nullable(),
	taxInclusivePriceCny: z.number().nullable(),
	priceCny: z.number().nullable(),
	unitPriceCny: z.number().nullable(),
	sourceAttribute: z.string().nullable(),
});
export type ImportRetailSalesData = z.infer<typeof importRetailSalesDataSchema>;

const retailSalesDataResponseSchema = z.object({
	id: z.string(),
	batchId: z.number(),
	date: z.string().datetime({ message: "Date is required" }),
	receiptType: z.string(),
	productId: z.number(),
	salesVolume: z.number(),
	client: z.string(),
	platformOrderId: z.string(),
	storehouse: z.string(),
	category: z.string().nullable(),
	sourceAttribute: z.string().nullable(),
	taxInclusivePriceCny: z.number().nullable(),
	priceCny: z.number().nullable(),
	unitPriceCny: z.number().nullable(),
	productSku: z.string(),
	productNameZhCn: z.string(),
});
export type RetailSalesDataResponse = z.infer<
	typeof retailSalesDataResponseSchema
>;

export const filteredRetailSalesDataResponseSchema = z.object({
	retailSalesData: z.array(retailSalesDataResponseSchema),
	clients: z.object({
		availableClients: z.array(z.string()),
		allClients: z.array(z.string()),
	}),
	storehouses: z.object({
		availableStorehouses: z.array(z.string()),
		allStorehouses: z.array(z.string()),
	}),
	categories: z.object({
		availableCategories: z.array(z.string()),
		allCategories: z.array(z.string()),
	}),
	receiptTypes: z.object({
		availableReceiptTypes: z.array(z.string()),
		allReceiptTypes: z.array(z.string()),
	}),
	sourceAttributes: z.object({
		availableSourceAttributes: z.array(z.string()),
		allSourceAttributes: z.array(z.string()),
	}),
});
export type FilteredRetailSalesDataResponse = z.infer<
	typeof filteredRetailSalesDataResponseSchema
>;
