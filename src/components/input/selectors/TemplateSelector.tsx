import { useAuthStore } from "@/stores/auth";
import { getMyRoleTemplates, PerformanceQK } from "@/utils/api/app/performance";
import { PerformanceEventTemplateResponse } from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { DropdownInput } from "../DropdownInput";

type TemplateSelectorProps = {
	template: PerformanceEventTemplateResponse | undefined;
	setTemplate: Dispatch<
		SetStateAction<PerformanceEventTemplateResponse | undefined>
	>;
	hover: PerformanceEventTemplateResponse | undefined;
	setHover: Dispatch<
		SetStateAction<PerformanceEventTemplateResponse | undefined>
	>;
};

export const TemplateSelector = (props: TemplateSelectorProps) => {
	const jwt = useAuthStore((state) => state.jwt);

	const templatesQuery = useQuery<
		PerformanceEventTemplateResponse[],
		AxiosError
	>({
		queryKey: [PerformanceQK.GET_MY_ROLE_TEMPLATES, jwt],
		queryFn: async () => {
			const templates = await getMyRoleTemplates(jwt);
			return templates;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const { template, setTemplate, hover, setHover } = props;

	return (
		<DropdownInput
			mode="search"
			selected={template}
			setSelected={setTemplate}
			hover={hover}
			setHover={setHover}
			options={templatesQuery.data ?? []}
			placeholder="Select a template"
			labelProp={{ primary: "description" }}
			sortBy="description"
		/>
	);
};
