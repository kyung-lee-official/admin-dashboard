import { Button } from "@/components/button/Button";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FileToUpload } from "./FileToUpload";
import { FileToPreview } from "./file-to-preview/FileToPreview";
import {
	getAttachmentListByEventId,
	getMyPermissionOfEvent,
	PerformanceQK,
} from "@/utils/api/app/performance";
import { useAuthStore } from "@/stores/auth";
import { PageBlock } from "@/components/content/PageContainer";
import { EventResponse } from "@/utils/types/app/performance";

export type Item = File | Preview;
export type Preview = {
	name: string;
};

export const Attachments = (props: { event: EventResponse }) => {
	const { event } = props;
	const inputRef = useRef<HTMLInputElement>(null);

	/* displayList = serverData + uploadList */
	const [serverData, setServerData] = useState<Preview[]>([]);
	const [uploadList, setUploadList] = useState<File[]>([]);
	const [displayList, setDisplayList] = useState<Item[]>([]);

	const jwt = useAuthStore((state) => state.jwt);
	const myEventPermissionsQuery = useQuery({
		queryKey: [PerformanceQK.GET_MY_PERMISSION_OF_EVENT, event.id],
		queryFn: async () => {
			const eventPerms = await getMyPermissionOfEvent(event.id, jwt);
			return eventPerms;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});
	const previewQuery = useQuery<Preview[], AxiosError>({
		queryKey: [PerformanceQK.GET_ATTACHMENT_LIST, event.id],
		queryFn: async () => {
			const data = await getAttachmentListByEventId(event.id, jwt);
			return data;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});
	useEffect(() => {
		if (previewQuery.data) {
			setServerData(previewQuery.data);
		}
	}, [previewQuery.data]);

	async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		const files = e.target.files;
		if (!files) return;
		// console.log(files);
		/* convert FileList to Array so it can be mapped */
		setUploadList(Array.from(files));
	}
	useEffect(() => {
		if (uploadList) {
			setDisplayList([...serverData, ...uploadList]);
		}
	}, [serverData, uploadList]);

	return (
		<PageBlock
			title="Attachments"
			moreMenu={
				myEventPermissionsQuery.data &&
				myEventPermissionsQuery.data.actions["update"] ===
					"EFFECT_ALLOW" &&
				event.approval !== "APPROVED" && (
					<Button
						size="sm"
						onClick={() => {
							/* clear the input field */
							inputRef.current!.value = "";
							setUploadList([]);
							/* trigger the input field */
							inputRef.current?.click();
						}}
					>
						Upload
					</Button>
				)
			}
		>
			<div
				className="grid justify-items-stretch 
				xl:grid-cols-8
				lg:grid-cols-6
				sm:grid-cols-3
				grid-cols-2
				w-full min-h-32 p-2 gap-6
				border-t-[1px] border-white/10"
			>
				<input
					type="file"
					multiple
					ref={inputRef}
					onChange={onFileChange}
					className="hidden"
				/>
				{displayList.length > 0 &&
					displayList.map((file, i) => {
						if (file instanceof File) {
							return (
								<FileToUpload
									key={file.name + i + "upload"}
									eventId={event.id}
									file={file}
									setUploadList={setUploadList}
								/>
							);
						} else {
							return (
								<FileToPreview
									key={file.name + i + "preview"}
									eventId={event.id}
									preview={file}
								/>
							);
						}
					})}
			</div>
		</PageBlock>
	);
};
