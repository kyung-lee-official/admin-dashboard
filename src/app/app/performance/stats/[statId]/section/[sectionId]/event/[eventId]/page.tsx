import { Content } from "./Content";

export default async function Page({
	params,
}: {
	params: Promise<{ statId: string; sectionId: string; eventId: string }>;
}) {
	const { statId, sectionId, eventId } = await params;
	return (
		<Content
			statId={parseInt(statId)}
			sectionId={parseInt(sectionId)}
			eventId={parseInt(eventId)}
		/>
	);
}
