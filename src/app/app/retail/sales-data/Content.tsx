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
									"/app/retail/sales-data/import-records"
								);
							}}
						>
							<td>Manage Import Records</td>
						</tr>
					</Tbody>
				</Table>
			</PageBlock>
		</PageContainer>
	);
};
