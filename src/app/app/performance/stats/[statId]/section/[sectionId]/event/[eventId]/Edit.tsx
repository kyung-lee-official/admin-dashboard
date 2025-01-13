import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export const Edit = (props: {
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
		setScore,
		amount,
		setAmount,
		description,
		setDescription,
		attachments,
	} = props;

	const router = useRouter();

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
					<td>
						<textarea
							className="w-full px-2 py-1.5
							bg-white/10
							rounded-md outline-none
							border-[1px] border-white/10"
							value={description || ""}
							onChange={(e) => {
								setDescription(e.target.value);
							}}
						/>
					</td>
				</tr>
				<tr>
					<td>Score</td>
					<td>
						<input
							type="number"
							className="px-2 py-1.5
							bg-white/10
							rounded-md outline-none
							border-[1px] border-white/10"
							value={score}
							onChange={(e) => {
								setScore(parseInt(e.target.value));
							}}
						/>
					</td>
				</tr>
				<tr>
					<td>Amount</td>
					<td>
						<input
							type="number"
							className="px-2 py-1.5
							bg-white/10
							rounded-md outline-none
							border-[1px] border-white/10"
							value={amount}
							onChange={(e) => {
								setAmount(parseInt(e.target.value));
							}}
						/>
					</td>
				</tr>
				<tr>
					<td>Total Score</td>
					<td>{score * amount}</td>
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
