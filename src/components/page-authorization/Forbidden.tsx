import { PageBlock, PageContainer } from "../content/PageContainer";

export const Forbidden = () => {
	return (
		<PageContainer>
			<PageBlock
				title={
					<div
						className="flex justify-center w-full
						text-lg font-semibold"
					>
						You do not have permissions to access this page
					</div>
				}
			></PageBlock>
		</PageContainer>
	);
};
