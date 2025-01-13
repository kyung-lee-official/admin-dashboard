import { useState } from "react";
import { ItemLoading } from "../Icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "@/utils/react-query/react-query";
import { Item } from "./Item";
import { Preview } from "../Attachments";
import {
	deleteAttachment,
	getAttachment,
	PerformanceQK,
} from "@/utils/api/app/performance";
import { useAuthStore } from "@/stores/auth";

export const FileToPreview = (props: { eventId: number; preview: Preview }) => {
	const { eventId, preview } = props;
	const { name } = preview;
	const [url, setUrl] = useState<string>();

	const jwt = useAuthStore((state) => state.jwt);

	const fileBlobQuery = useQuery({
		queryKey: [PerformanceQK.GET_ATTACHMENT, name],
		queryFn: async () => {
			const blob = await getAttachment(eventId, name, jwt);
			setUrl(URL.createObjectURL(blob));
			return blob;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	async function onDelete() {
		await deleteAttachment(eventId, name, jwt);
		queryClient.invalidateQueries({
			queryKey: [PerformanceQK.GET_ATTACHMENT_LIST],
		});
	}

	return (
		<div>
			{fileBlobQuery.isPending ? (
				<ItemLoading />
			) : (
				<Item
					isLoading={fileBlobQuery.isPending || !url}
					eventId={eventId}
					name={name}
					src={url}
					question="Are you sure you want to delete this file?"
					onDelete={onDelete}
				/>
			)}
		</div>
	);
};
