import { FacebookGroupOverwriteSourceDto } from "@/utils/types/app/sns-crawler";
import axios from "axios";

export enum SnsCrawlerQK {
	OVERWRITE_FACEBOOK_GROUP_SOURCE_DATA = "overwrite-facebook-group-source-data",
	GET_FACEBOOK_GROUP_SOURCE_DATA = "get-facebook-group-source-data",
}

export const overwriteFacebookGroupSourceData = async (
	newData: FacebookGroupOverwriteSourceDto,
	jwt: string
) => {
	const res = await axios.patch(
		"internal/applications/facebook-group/overwrite-source",
		newData,
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const getFacebookGroupSourceData = async (jwt: string) => {
	const res = await axios.get("internal/applications/facebook-group/source", {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};
