import { Content } from "./Content";

export default async function Page({
	params,
}: {
	params: Promise<{ statId: string; sectionId: string }>;
}) {
	const { statId, sectionId } = await params;
	return (
		<Content statId={parseInt(statId)} sectionId={parseInt(sectionId)} />
	);
}
