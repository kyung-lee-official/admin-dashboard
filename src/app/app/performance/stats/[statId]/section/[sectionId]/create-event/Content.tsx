"use client";

import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import {
	getMySectionPermissions,
	getSectionById,
	getStatById,
	PerformanceQK,
} from "@/utils/api/app/performance";
import {
	PerformanceStatResponse,
	SectionResponse,
} from "@/utils/types/app/performance";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { CreateEvent } from "./CreateEvent";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
import { AxiosExceptions } from "@/components/page-authorization/AxiosExceptions";
import { Exception } from "@/components/page-authorization/Exception";
import { Forbidden } from "@/components/page-authorization/Forbidden";

export const Content = (props: { statId: number; sectionId: number }) => {
	const { statId, sectionId } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const mySectionPermissionsQuery = useQuery<any, AxiosError>({
		queryKey: [PerformanceQK.GET_MY_SECTION_PERMISSIONS],
		queryFn: async () => {
			const section = await getMySectionPermissions(sectionId, jwt);
			return section;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const sectionQuery = useQuery<SectionResponse, AxiosError>({
		queryKey: [PerformanceQK.GET_SECTION_BY_ID],
		queryFn: async () => {
			const section = await getSectionById(sectionId, jwt);
			return section;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (mySectionPermissionsQuery.isLoading) {
		return <Loading />;
	}

	if (mySectionPermissionsQuery.isError) {
		return <AxiosExceptions error={mySectionPermissionsQuery.error} />;
	}

	if (
		mySectionPermissionsQuery.data &&
		mySectionPermissionsQuery.data.actions["create-event"] === "EFFECT_DENY"
	) {
		return <Forbidden />;
	}

	if (sectionQuery.isLoading) {
		return <Loading />;
	}

	if (sectionQuery.isError) {
		return <AxiosExceptions error={sectionQuery.error} />;
	}

	if (!sectionQuery.data) {
		return <Exception />;
	}

	const { stat, memberRole, events } = sectionQuery.data;
	const { month, owner } = stat;

	return (
		<PageContainer>
			<PageBlock title="Stat">
				<Table>
					<Tbody>
						<tr>
							<td>Month</td>
							<td>{dayjs(month).format("MMMM YYYY")}</td>
						</tr>
						<tr>
							<td>Owner</td>
							<td>
								{owner.name} ({owner.email})
							</td>
						</tr>
					</Tbody>
				</Table>
			</PageBlock>
			<PageBlock title="Section">
				<Table>
					<Tbody>
						<tr>
							<td>Section Role</td>
							<td>{memberRole.id}</td>
						</tr>
						<tr>
							<td>Section Title</td>
							<td>{sectionQuery.data.title}</td>
						</tr>
						<tr>
							<td>Section Weight</td>
							<td>{sectionQuery.data.weight}</td>
						</tr>
						<tr>
							<td>Section Description</td>
							<td>{sectionQuery.data.description}</td>
						</tr>
					</Tbody>
				</Table>
			</PageBlock>
			<CreateEvent statId={statId} section={sectionQuery.data} />
		</PageContainer>
	);
};
