"use client";

import { SaclContext, Unauthorized } from "@/components";
import { CheckingSeeded } from "@/components/sacl/CheckingSeeded";
import { CheckingSignedIn } from "@/components/sacl/CheckingSignedIn";
import { NetworkError } from "@/components/sacl/NetworkError";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const SaclComponentWrapper = () => {
	const { saclStatus } = useContext(SaclContext);

	switch (saclStatus) {
		case "isSeededQuery.isLoading":
			return (
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<CheckingSeeded />
				</motion.div>
			);
			break;
		case "isSeededQuery.isError":
			return (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
				>
					<NetworkError />
				</motion.div>
			);
			break;
		case "isSignedInQuery.isLoading":
			return (
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<CheckingSignedIn />
				</motion.div>
			);
			break;
		case "isSignedInQuery.unauthorized":
			return (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<Unauthorized />
				</motion.div>
			);
			break;
		case "isSignedInQuery.isError":
			return (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
				>
					<NetworkError />
				</motion.div>
			);
			break;
		default:
			return (
				<motion.div
					initial={{ opacity: 1, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
				>
					{null}
				</motion.div>
			);
			break;
	}
};

export default function Index() {
	const router = useRouter();
	const { saclStatus } = useContext(SaclContext);

	if (saclStatus === "isSeededQuery.notSeeded") {
		router.push("/seed");
	}

	if (saclStatus === "isSignedInQuery.isSuccess") {
		router.push("/home");
	}

	return (
		<main className="flex justify-between items-center min-h-screen">
			<AnimatePresence mode="wait">
				<SaclComponentWrapper key={saclStatus} />
			</AnimatePresence>
		</main>
	);
}
