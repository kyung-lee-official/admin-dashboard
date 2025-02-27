import { redirect } from "next/navigation";

const Page = () => {
	redirect("chitubox-docs-analytics/chitubox-docs-user-feedback");
	return <div>redirecting...</div>;
};

export default Page;
