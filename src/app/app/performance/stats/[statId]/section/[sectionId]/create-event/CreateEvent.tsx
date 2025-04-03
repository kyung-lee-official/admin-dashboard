import { Button } from "@/components/button/Button";
import { PageBlock } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
import { DecimalInput } from "@/components/input/decimal-input/DecimalInput";
import { TemplateSelector } from "@/components/input/selectors/TemplateSelector";
import { Toggle } from "@/components/toggle/Toggle";
import { useAuthStore } from "@/stores/auth";
import { createEvent } from "@/utils/api/app/performance";
import {
	CreateEventDto,
	PerformanceEventTemplateResponse,
	SectionResponse,
} from "@/utils/types/app/performance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CreateEvent = (props: {
	statId: string;
	section: SectionResponse;
}) => {
	const { statId, section } = props;

	const [oldData, setOldData] = useState<CreateEventDto>({
		templateId: undefined,
		sectionId: section.id,
		score: 0,
		description: "",
	});
	const [newData, setNewData] = useState<CreateEventDto>(oldData);
	const [template, setTemplate] = useState<
		PerformanceEventTemplateResponse | undefined
	>();
	const [hover, setHover] = useState<
		PerformanceEventTemplateResponse | undefined
	>(template);
	const [score, setScore] = useState(0);
	const [description, setDescription] = useState("");

	const [useTemplate, setUseTemplate] = useState(true);

	useEffect(() => {
		if (useTemplate) {
			if (template?.id) {
				setNewData({
					templateId: template.id,
					sectionId: section.id,
					score: template.score,
					description: template.description,
				});
			} else {
				setNewData({
					templateId: undefined,
					sectionId: section.id,
					score: score,
					description: description,
				});
			}
		} else {
			setNewData({
				templateId: undefined,
				sectionId: section.id,
				score: score,
				description: description,
			});
		}
	}, [useTemplate, template, section.id, score, description]);

	const jwt = useAuthStore((state) => state.jwt);

	const router = useRouter();
	const mutation = useMutation({
		mutationFn: () => {
			return createEvent(newData, jwt);
		},
		onSuccess: (data) => {
			router.push(
				`/app/performance/stats/${statId}/section/${section.id}/event/${data.id}`
			);
		},
		onError: () => {},
	});

	function onCreate() {
		mutation.mutate();
	}

	return (
		<>
			<PageBlock
				title="Create Event"
				moreMenu={
					((useTemplate && template) || !useTemplate) && (
						<Button
							size="sm"
							onClick={() => {
								onCreate();
							}}
						>
							Create
						</Button>
					)
				}
			>
				<Table>
					<Tbody>
						<tr>
							<td className="w-1/2">Use Template</td>
							<td className="w-1/2">
								<Toggle
									isOn={useTemplate}
									isAllowed={true}
									onClick={() => {
										setUseTemplate(!useTemplate);
									}}
								/>
							</td>
						</tr>
					</Tbody>
				</Table>
			</PageBlock>
			{useTemplate ? (
				<PageBlock title="Template">
					<Table>
						<Tbody>
							<tr className={useTemplate ? "" : "text-white/20"}>
								<td className="w-1/2">
									<TemplateSelector
										section={section}
										template={template}
										setTemplate={setTemplate}
										setHover={setHover}
									/>
								</td>
								<td className="w-1/2">
									{hover && hover.description}
								</td>
							</tr>
							<tr>
								<td className="w-1/2">Score</td>
								<td className="w-1/2">
									{hover ? hover.score : 0}
								</td>
							</tr>
						</Tbody>
					</Table>
				</PageBlock>
			) : (
				<PageBlock title="Content">
					<Table>
						<Tbody>
							<tr>
								<td className="w-1/2">Score</td>
								<td className="w-1/2">
									<DecimalInput
										value={score}
										onChange={(v) => {
											setScore(v as number);
										}}
									/>
								</td>
							</tr>
							<tr>
								<td className="w-1/2">Description</td>
								<td className="w-1/2">
									<textarea
										className="px-2 py-1.5 w-full
										bg-white/10
										rounded-md outline-none
										border-[1px] border-white/10"
										placeholder="Required"
										value={description || ""}
										onChange={(e) => {
											setDescription(e.target.value);
										}}
									/>
								</td>
							</tr>
						</Tbody>
					</Table>
				</PageBlock>
			)}
		</>
	);
};
