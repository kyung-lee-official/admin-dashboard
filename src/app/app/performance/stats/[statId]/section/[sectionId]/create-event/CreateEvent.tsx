import { Button } from "@/components/button/Button";
import { TemplateSelector } from "@/components/input/selectors/TemplateSelector";
import { Toggle } from "@/components/toggle/Toggle";
import { useAuthStore } from "@/stores/auth";
import { createEvent, PerformanceQK } from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import {
	CreateEventDto,
	PerformanceEventTemplateResponse,
} from "@/utils/types/app/performance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CreateEvent = (props: { statId: string; sectionId: string }) => {
	const { statId, sectionId } = props;

	const [oldData, setOldData] = useState<CreateEventDto>({
		templateId: undefined,
		sectionId: parseInt(sectionId),
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
					sectionId: parseInt(sectionId),
					score: template.score,
					description: template.description,
				});
			} else {
				setNewData({
					templateId: undefined,
					sectionId: parseInt(sectionId),
					score: score,
					description: description,
				});
			}
		} else {
			setNewData({
				templateId: undefined,
				sectionId: parseInt(sectionId),
				score: score,
				description: description,
			});
		}
	}, [useTemplate, template, sectionId, score, description]);

	const jwt = useAuthStore((state) => state.jwt);

	const router = useRouter();
	const mutation = useMutation({
		mutationFn: () => {
			return createEvent(newData, jwt);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_STATS],
			});
			router.push(
				`/app/performance/stats/${statId}/section/${sectionId}/event/${data.id}`
			);
		},
		onError: () => {},
	});

	function onCreate() {
		mutation.mutate();
	}

	return (
		<div className="flex flex-col gap-y-3">
			<div
				className="text-white/50
				bg-white/5
				border-[1px] border-white/10 border-t-white/15
				rounded-md"
			>
				<div className="relative flex justify-between items-center px-6 py-4">
					<div>Create Event</div>
					<Button
						size="sm"
						onClick={() => {
							onCreate();
						}}
					>
						Create
					</Button>
				</div>
				<table
					className="w-full
					text-sm text-white/50"
				>
					<tbody
						className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
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
					</tbody>
				</table>
			</div>
			{useTemplate ? (
				<div
					className="text-white/50
					bg-white/5
					border-[1px] border-white/10 border-t-white/15
					rounded-md"
				>
					<div className="relative flex justify-between items-center px-6 py-4">
						<div>Template</div>
					</div>
					<table
						className="w-full
						text-sm text-white/50"
					>
						<tbody
							className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
							[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
						>
							<tr className={useTemplate ? "" : "text-white/20"}>
								<td className="w-1/2">
									<TemplateSelector
										template={template}
										setTemplate={setTemplate}
										hover={hover}
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
						</tbody>
					</table>
				</div>
			) : (
				<div
					className="text-white/50
					bg-white/5
					border-[1px] border-white/10 border-t-white/15
					rounded-md"
				>
					<div className="relative flex justify-between items-center px-6 py-4">
						<div>Content</div>
					</div>
					<table
						className="w-full
						text-sm text-white/50"
					>
						<tbody
							className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
							[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
						>
							<tr>
								<td className="w-1/2">Score</td>
								<td className="w-1/2">
									<input
										type="number"
										className="px-2 py-1.5
										bg-white/10
										rounded-md outline-none
										border-[1px] border-white/10"
										placeholder="integer only"
										value={score}
										onChange={(e) => {
											setScore(parseInt(e.target.value));
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
										value={description}
										onChange={(e) => {
											setDescription(e.target.value);
										}}
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};
