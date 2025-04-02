import { PageBlock, PageContainer } from "../content/PageContainer";

export const ResourceNotFound = () => {
	return (
		<PageContainer>
			<PageBlock
				title={
					<div
						className="flex justify-center w-full
						text-lg font-semibold"
					>
						Resouce Not Found
					</div>
				}
			></PageBlock>
		</PageContainer>
	);
};
