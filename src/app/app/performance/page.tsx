import { redirect } from "next/navigation";

const Page = () => {
	redirect("performance/stats");
	return <div>redirecting...</div>;
};

export default Page;
