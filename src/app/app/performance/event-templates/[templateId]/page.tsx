import { Content } from "./Content";

export default async function Page({
	params,
}: {
	params: Promise<{ templateId: string }>;
}) {
	const { templateId } = await params;
	return <Content templateId={templateId} />;
}
