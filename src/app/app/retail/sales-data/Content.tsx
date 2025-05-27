"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
import { Exception } from "@/components/page-authorization/Exception";
import { Forbidden } from "@/components/page-authorization/Forbidden";
import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import {
	getPermissions,
	RetailSalesDataQK,
} from "@/utils/api/app/retail/sales-data";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export const Content = () => {
	const jwt = useAuthStore((state) => state.jwt);
	const salesDataPermQuery = useQuery({
		queryKey: [RetailSalesDataQK.GET_SALES_DATA_PERMISSIONS],
		queryFn: async () => {
			const data = await getPermissions(jwt);
			return data;
		},
	});

	if (salesDataPermQuery.isPending) {
		return <Loading />;
	}

	if (salesDataPermQuery.isSuccess && salesDataPermQuery.data) {
		switch (salesDataPermQuery.data.actions["*"]) {
			case "EFFECT_DENY":
				return <Forbidden />;
			case "EFFECT_ALLOW":
				return (
					<PageContainer>
						<PageBlock title="Sales Data">
							<Table>
								<Tbody>
									<tr
										className="cursor-pointer"
										onClick={() => {
											redirect(
												"/app/retail/sales-data/import-batches"
											);
										}}
									>
										<td>Manage Import Batches</td>
									</tr>
									<tr
										className="cursor-pointer"
										onClick={() => {
											redirect(
												"/app/retail/sales-data/kanban"
											);
										}}
									>
										<td>Kanban</td>
									</tr>
								</Tbody>
							</Table>
						</PageBlock>
					</PageContainer>
				);
			default:
				return <Exception />;
		}
	} else {
		return <Exception />;
	}
};
