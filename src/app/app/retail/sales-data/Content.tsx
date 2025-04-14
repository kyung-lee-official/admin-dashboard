"use client";

import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
import { redirect } from "next/navigation";

export const Content = () => {
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
					</Tbody>
				</Table>
			</PageBlock>
		</PageContainer>
	);
};
