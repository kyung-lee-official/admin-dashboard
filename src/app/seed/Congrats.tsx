import lottieFiles from "@/components/lottie-animations/animation_congratulations.json";
import Lottie from "lottie-react";

const Congrats = () => {
	return <Lottie animationData={lottieFiles} loop={false} autoplay />;
};

export default Congrats;
