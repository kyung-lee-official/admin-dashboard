"use client";

import { Button } from "@/components/button/Button";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Input } from "@/components/input/Input";
import { Loading } from "@/components/page-authorization/Loading";
import { UnknownError } from "@/components/sacl/UnknownError";
import { useAuthStore } from "@/stores/auth";
import { getLogs, LogQK } from "@/utils/api/log";
import { Log } from "@/utils/types/internal";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const LogDetails = (props: { log: Log; i: number }) => {
	const { i, log } = props;
	const { memberId, memberName, eventType, createdAt } = log;
	switch (eventType) {
		case "SIGN_IN":
			return (
				<div
					className={`flex justify-between py-4 px-3
					text-sm
					${i !== 0 ? "border-t border-white/10" : ""}`}
				>
					<div className="flex items-center gap-2">
						<div>{memberName}</div>
						<div className="text-neutral-500">{memberId}</div>
					</div>
					<div>
						signed in at{" "}
						{dayjs(createdAt).format("MMM DD YYYY, HH:mm:ss")}
					</div>
				</div>
			);
		default:
			return null;
	}
};

export const Content = (props: { pageId: number }) => {
	const { pageId } = props;
	const router = useRouter();
	const jwt = useAuthStore((state) => state.jwt);
	const inputRef = useRef<HTMLInputElement>(null);

	const logsQuery = useQuery<Log[], AxiosError>({
		queryKey: [LogQK.GET_LOGS, jwt],
		queryFn: async () => {
			const isSignedIn = await getLogs(pageId, jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const handlePrev = () => {
		router.push(`${pageId - 1}`);
	};

	const handleNext = () => {
		router.push(`${pageId + 1}`);
	};

	const handleGotoPage = () => {
		const page = parseInt(inputRef.current?.value || "1");
		router.push(`${page}`);
	};

	if (logsQuery.isPending) {
		return <Loading />;
	}

	if (logsQuery.isError || !logsQuery.data) {
		return <UnknownError />;
	}

	return (
		<PageContainer>
			<PageBlock title="Logs">
				{!!logsQuery.data.length ? (
					<div
						className="text-white/60
						rounded-md border-y-[1px] border-white/10 border-t-white/15"
					>
						{logsQuery.data.map((log, i) => {
							return <LogDetails key={i} i={i} log={log} />;
						})}
					</div>
				) : (
					<div className="text-white/50">No Data</div>
				)}
				<div className="flex justify-end items-center p-3 gap-3">
					{pageId > 1 && (
						<Button size={"sm"} onClick={handlePrev}>
							Prev
						</Button>
					)}
					<div
						className="flex items-center gap-2
					text-white/50"
					>
						<Input
							ref={inputRef}
							type={"number"}
							sz="sm"
							isError={false}
						/>
						<Button size="sm" onClick={handleGotoPage}>
							Go
						</Button>
					</div>
					<Button size={"sm"} onClick={handleNext}>
						Next
					</Button>
				</div>
			</PageBlock>
		</PageContainer>
	);
};
