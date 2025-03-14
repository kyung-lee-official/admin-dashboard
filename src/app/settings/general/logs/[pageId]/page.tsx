import { Content } from "./Content";

export default async function Page({
	params,
}: {
	params: Promise<{ pageId: string }>;
}) {
	const { pageId } = await params;
	return <Content pageId={parseInt(pageId)} />;
}
