import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export const Data = (props: {
	setIsEditing: Dispatch<SetStateAction<boolean>>;
	id: number;
	templateId?: number;
	templateScore?: number;
	templateDescription?: string;
	score: number;
	setScore: Dispatch<SetStateAction<number>>;
	amount: number;
	setAmount: Dispatch<SetStateAction<number>>;
	description: string;
	setDescription: Dispatch<SetStateAction<string>>;
	attachments: string[];
}) => {
	const {
		setIsEditing,
		id,
		templateId,
		templateScore,
		templateDescription,
		score,
		amount,
		description,
		attachments,
	} = props;

	const router = useRouter();
	const jwt = useAuthStore((state) => state.jwt);

	return (
		<table
			className="w-full
			text-sm text-white/50"
		>
			<tbody
				className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
				[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
			>
				<tr>
					<td className="w-1/2">Event ID</td>
					<td className="w-1/2">{id}</td>
				</tr>
				<tr>
					<td>Description</td>
					<td>{description}</td>
				</tr>
				<tr>
					<td>Score</td>
					<td>{score}</td>
				</tr>
				<tr>
					<td>Amount</td>
					<td>{amount}</td>
				</tr>
				<tr>
					<td>Total Score</td>
					<td>{(score * amount).toFixed(3)}</td>
				</tr>
				{templateId && (
					<>
						<tr
							className="text-white/30
							hover:bg-white/5
							hover:cursor-pointer"
							onClick={() => {
								router.push(
									`/app/performance/event-templates/${templateId}`
								);
							}}
						>
							<td>Temmplate ID</td>
							<td>{templateId}</td>
						</tr>
						<tr className="text-white/30">
							<td>Temmplate Score</td>
							<td>{templateScore}</td>
						</tr>
						<tr className="text-white/30">
							<td>Temmplate Description</td>
							<td>{templateDescription}</td>
						</tr>
					</>
				)}
			</tbody>
		</table>
	);
};
