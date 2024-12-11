import { Content } from "./Content";

export default async function Page({
	params,
}: {
	params: Promise<{ statId: string }>;
}) {
	const { statId } = await params;
	return <Content statId={statId} />;
}
