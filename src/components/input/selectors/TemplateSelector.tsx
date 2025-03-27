import { useAuthStore } from "@/stores/auth";
import {
	getTemplatesBySectionRoleId,
	PerformanceQK,
} from "@/utils/api/app/performance";
import {
	PerformanceEventTemplateResponse,
	SectionResponse,
} from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { Dropdown } from "../dropdown/Dropdown";

type TemplateSelectorProps = {
	section: SectionResponse;
	template: PerformanceEventTemplateResponse | undefined;
	setTemplate: Dispatch<
		SetStateAction<PerformanceEventTemplateResponse | undefined>
	>;
	setHover: Dispatch<
		SetStateAction<PerformanceEventTemplateResponse | undefined>
	>;
};

export const TemplateSelector = (props: TemplateSelectorProps) => {
	const { section, template, setTemplate, setHover } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const templatesQuery = useQuery<
		PerformanceEventTemplateResponse[],
		AxiosError
	>({
		queryKey: [PerformanceQK.GET_TEMPLATES_BY_SECTION_ROLE_ID],
		queryFn: async () => {
			const templates = await getTemplatesBySectionRoleId(
				section.memberRoleId,
				jwt
			);
			return templates;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	return (
		<Dropdown
			kind="object"
			mode="search"
			selected={template}
			setSelected={setTemplate}
			setHover={setHover}
			options={templatesQuery.data ?? []}
			placeholder="Select a template"
			label={{ primaryKey: "description" }}
			sortBy="description"
		/>
	);
};
