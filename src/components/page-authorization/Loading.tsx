import { PageBlock, PageContainer } from "../content/PageContainer";
import { OneRowSkeleton } from "../skeleton/OneRowSkeleton";

export const Loading = () => {
	return (
		<PageContainer>
			<PageBlock
				title={
					<div
						className="flex justify-center w-full
						text-lg font-semibold"
					>
						<OneRowSkeleton />
					</div>
				}
			></PageBlock>
		</PageContainer>
	);
};
