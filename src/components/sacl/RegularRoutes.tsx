"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useContext } from "react";
import { CheckingSeeded } from "./CheckingSeeded";
import { NetworkError } from "./NetworkError";
import { CheckingSignedIn } from "./CheckingSignedIn";
import { Unauthorized } from "./Unauthorized";
import { SaclContext } from ".";
import { useRouter } from "next/navigation";

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

export const RegularRoutes = (props: any) => {
	const router = useRouter();
	const { children } = props;
	const { saclStatus } = useContext(SaclContext);

	if (saclStatus === "isSeededQuery.notSeeded") {
		router.push("/seed");
	}

	if (saclStatus === "isSignedInQuery.isSuccess") {
		return <div>{children}</div>;
	}

	return (
		<AnimatePresence mode="wait">
			<div className="auth-mask">
				<SaclComponentWrapper key={saclStatus} />
			</div>
		</AnimatePresence>
	);
};
