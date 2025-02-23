import { Content } from "./Content";

const Page = async ({ params }: { params: Promise<{ taskId: string }> }) => {
	const { taskId } = await params;

	return <Content taskId={parseInt(taskId)} />;
};

export default Page;
