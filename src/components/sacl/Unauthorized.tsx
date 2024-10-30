"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Unauthorized() {
	const router = useRouter();
	const [countDown, setCountDown] = useState<number>(3);
	useEffect(() => {
		const interval = setInterval(() => {
			if (countDown > 0) {
				setCountDown((countDown) => {
					return countDown - 1;
				});
			} else {
				router.push("/sign-in");
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [countDown]);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				className="flex flex-col items-center gap-6"
				key={"countDown"}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 20 }}
			>
				<div
					className="flex justify-center items-center
						p-5
						text-neutral-300 bg-red-500
						rounded-2xl shadow-lg"
				>
					Unauthorized
				</div>
				<div>Redirecting to thesign-in page...({countDown})</div>
			</motion.div>
		</AnimatePresence>
	);
}
