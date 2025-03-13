import dynamic from "next/dynamic";

export const DynamicCongrats = dynamic(() => import("./Congrats"), {
	ssr: false,
});
