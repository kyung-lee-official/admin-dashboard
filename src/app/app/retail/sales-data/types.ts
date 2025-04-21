import { z } from "zod";

export const retailSalesDataSchema = z.object({
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
export type RetailSalesData = z.infer<typeof retailSalesDataSchema>;

export const retailSalesDataResponseSchema = z.object({
	id: z.string(),
	batchId: z.number(),
	date: z.string().datetime({ message: "Date is required" }),
	receiptTypeId: z.number(),
	clientId: z.number(),
	departmentId: z.number(),
	productId: z.number(),
	salesVolume: z.number(),
	platformAddressId: z.number().nullable(),
	platformOrderId: z.string(),
	storehouseId: z.number(),
	categoryId: z.number().nullable(),
	sourceAttributeId: z.number().nullable(),
	taxInclusivePriceCny: z.number().nullable(),
	priceCny: z.number().nullable(),
	unitPriceCny: z.number().nullable(),
	receiptType: z.object({
		id: z.number(),
		receiptType: z.string(),
	}),
	client: z.object({
		id: z.number(),
		client: z.string(),
	}),
	product: z.object({
		id: z.number(),
		sku: z.string(),
		nameZhCn: z.string(),
	}),
	storehouse: z.object({
		id: z.number(),
		storehouse: z.string(),
	}),
	category: z
		.object({
			id: z.number(),
			category: z.string(),
		})
		.nullable(),
	sourceAttribute: z
		.object({
			id: z.number(),
			sourceAttribute: z.string(),
		})
		.nullable(),
});
export type RetailSalesDataResponse = z.infer<
	typeof retailSalesDataResponseSchema
>;
