import { AxiosError } from "axios";
import { PageBlock, PageContainer } from "../content/PageContainer";
import { Forbidden } from "./Forbidden";
import { ResourceNotFound } from "./ResourceNotFound";

export const AxiosExceptions = (props: { error: AxiosError<unknown, any> }) => {
	const { error } = props;
	switch (error.status) {
		case 403:
			return (
				<PageContainer>
					<Forbidden />
				</PageContainer>
			);
		case 404:
			return (
				<PageContainer>
					<ResourceNotFound />
				</PageContainer>
			);
		default:
			return (
				<PageContainer>
					<PageBlock
						title={
							<div
								className="flex justify-center w-full
							text-lg font-semibold"
							>
								Error: {error.message}
							</div>
						}
					></PageBlock>
				</PageContainer>
			);
	}
};
