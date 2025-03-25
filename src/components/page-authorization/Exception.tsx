import { PageBlock, PageContainer } from "../content/PageContainer";

export const Exception = () => {
	return (
		<PageContainer>
			<PageBlock
				title={
					<div
						className="flex justify-center w-full
						text-lg font-semibold"
					>
						Something went wrong 🤯
					</div>
				}
			></PageBlock>
		</PageContainer>
	);
};
