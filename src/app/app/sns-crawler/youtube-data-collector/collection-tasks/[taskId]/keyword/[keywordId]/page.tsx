import { Content } from "./Content";

const Page = async ({
	params,
}: {
	params: Promise<{ taskId: string; keywordId: string }>;
}) => {
	const { taskId, keywordId } = await params;

	return (
		<Content taskId={parseInt(taskId)} keywordId={parseInt(keywordId)} />
	);
};

export default Page;
