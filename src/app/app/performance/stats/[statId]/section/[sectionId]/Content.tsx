"use client";

import { Button } from "@/components/button/Button";
import { CircularProgress } from "@/components/progress/circular-progress/CircularProgress";
import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import {
	deleteSectionById,
	getMySectionPermissions,
	getSectionById,
	PerformanceQK,
} from "@/utils/api/app/performance";
import {
	ApprovalType,
	EventResponse,
	SectionResponse,
} from "@/utils/types/app/performance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageBlock, PageContainer } from "@/components/content/PageContainer";
import { Table, Tbody } from "@/components/content/Table";
import { Exception } from "@/components/page-authorization/Exception";
import { TitleMoreMenu } from "@/components/content/TitleMoreMenu";
import { EditIcon } from "@/components/icons/Icons";
import { ConfirmDialog } from "@/components/confirm-dialog/ConfirmDialog";
import { useState } from "react";
import { AxiosExceptions } from "@/components/page-authorization/AxiosExceptions";
import {
	EditId,
	EditPanel,
	EditProps,
} from "@/components/edit-panel/EditPanel";
import { createPortal } from "react-dom";

const SectionMoreMenu = (props: { sectionId: number }) => {
	const { sectionId } = props;
	const jwt = useAuthStore((state) => state.jwt);
	const router = useRouter();

	const [edit, setEdit] = useState<EditProps>({
		show: false,
		id: EditId.EDIT_SECTION,
		auxData: {
			sectionId: sectionId,
		},
	});

	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const mySectionPermissionsQuery = useQuery({
		queryKey: [PerformanceQK.GET_MY_SECTION_PERMISSIONS],
		queryFn: async () => {
			const section = await getMySectionPermissions(sectionId, jwt);
			return section;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const mutation = useMutation({
		mutationFn: () => {
			return deleteSectionById(sectionId, jwt);
		},
		onSuccess: () => {
			router.push("/app/performance/stats");
		},
		onError: () => {},
	});

	function onDelete() {
		mutation.mutate();
	}

	if (
		mySectionPermissionsQuery.data &&
		(mySectionPermissionsQuery.data.actions["update"] === "EFFECT_ALLOW" ||
			mySectionPermissionsQuery.data.actions["delete"] === "EFFECT_ALLOW")
	) {
		const items = [];
		if (
			mySectionPermissionsQuery.data.actions["update"] === "EFFECT_ALLOW"
		) {
			items.push({
				content: "Edit Section",
				hideMenuOnClick: true,
				icon: <EditIcon size={15} />,
				onClick: () => {
					setEdit({
						show: true,
						id: EditId.EDIT_SECTION,
						auxData: {
							sectionId: sectionId,
						},
					});
				},
			});
		}
		if (
			mySectionPermissionsQuery.data.actions["delete"] === "EFFECT_ALLOW"
		) {
			items.push({
				content: "Delete Section",
				type: "danger" as const,
				hideMenuOnClick: true,
				icon: <EditIcon size={15} />,
				onClick: () => {
					setShowDeleteConfirmation(true);
				},
			});
		}
		return (
			<>
				<TitleMoreMenu items={items} />
				{createPortal(
					<EditPanel edit={edit} setEdit={setEdit} />,
					document.body
				)}
				<ConfirmDialog
					show={showDeleteConfirmation}
					setShow={setShowDeleteConfirmation}
					question={"Are you sure you want to delete this section?"}
					description="Associated events will be deleted as well."
					onOk={onDelete}
				/>
			</>
		);
	} else {
		return null;
	}
};

export const Content = (props: { statId: number; sectionId: number }) => {
	const { statId, sectionId } = props;

	const jwt = useAuthStore((state) => state.jwt);
	const router = useRouter();

	const mySectionPermissionsQuery = useQuery({
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
			<PageBlock
				title="Section"
				moreMenu={<SectionMoreMenu sectionId={sectionId} />}
			>
				<Table>
					<Tbody>
						<tr>
							<td>Section Role</td>
							<td>
								<div
									className="flex w-fit px-1 gap-2
									border border-neutral-500 rounded"
								>
									<div>
										{sectionQuery.data.memberRole.name}
									</div>
									<div className="text-neutral-500">
										{sectionQuery.data.memberRole.id}
									</div>
								</div>
							</td>
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
						<tr>
							<td>Section Score</td>
							<td>
								<div className="flex items-center gap-2">
									<CircularProgress
										size={24}
										progress={Math.min(
											sectionQuery.data.events.reduce(
												(acc, e) =>
													acc +
													(e.approval ===
													ApprovalType.APPROVED
														? e.score * e.amount
														: 0),
												0
											),
											100
										)}
									/>
									{sectionQuery.data.events.reduce(
										(acc, e) =>
											acc +
											(e.approval ===
											ApprovalType.APPROVED
												? e.score * e.amount
												: 0),
										0
									)}
								</div>
							</td>
						</tr>
						<tr>
							<td>Submitted Score</td>
							<td>
								{sectionQuery.data.events.reduce(
									(acc, e) => acc + e.score * e.amount,
									0
								)}
							</td>
						</tr>
					</Tbody>
				</Table>
			</PageBlock>
			<PageBlock
				title="Events"
				moreMenu={
					mySectionPermissionsQuery.data &&
					mySectionPermissionsQuery.data.actions["create-event"] ===
						"EFFECT_ALLOW" && (
						<Button
							size="sm"
							onClick={() => {
								router.push(
									`${sectionQuery.data.id}/create-event`
								);
							}}
							className="truncate"
						>
							Create Event
						</Button>
					)
				}
			>
				<table className="text-sm text-white/50">
					<tbody
						className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
						[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10"
					>
						<tr>
							<td className="w-2/6">Description</td>
							<td className="w-1/6">Approval</td>
							<td className="w-1/6">Score</td>
							<td className="w-1/6">Amount</td>
							<td className="w-1/6">Total Score</td>
							<td>
								<div className="w-7 h-7">
									{/* placeholder */}
								</div>
							</td>
						</tr>
						{sectionQuery.data.events.map(
							(ev: EventResponse, i) => {
								return (
									<tr key={ev.id}>
										<td>{ev.description}</td>
										<td>{ev.approval}</td>
										<td>{ev.score}</td>
										<td>{ev.amount}</td>
										<td>{ev.score * ev.amount}</td>
										<td>
											<Link
												href={`${sectionQuery.data.id}/event/${ev.id}`}
												className="underline"
											>
												Details
											</Link>
										</td>
									</tr>
								);
							}
						)}
					</tbody>
				</table>
			</PageBlock>
		</PageContainer>
	);
};
