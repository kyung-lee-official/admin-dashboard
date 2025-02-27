import { redirect } from "next/navigation";

const Page = () => {
	redirect("sns-crawler/facebook-group");
	return <div>redirecting...</div>;
};

export default Page;
