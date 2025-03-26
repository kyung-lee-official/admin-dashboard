"use client";

import { Exception } from "@/components/page-authorization/Exception";
import { Loading } from "@/components/page-authorization/Loading";
import { useAuthStore } from "@/stores/auth";
import { getAllRoles, RolesQK } from "@/utils/api/roles";
import { MemberRole } from "@/utils/types/internal";
import { useQuery } from "@tanstack/react-query";
import { Controls, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AxiosError } from "axios";
import { useMemo } from "react";

type RoleNode = {
	id: string;
	position: { x: number; y: number };
	data: {
		label: string;
	};
	style: { width: number; height: number };
};

/**
 * set id, position and data,
 * position generated from left to right hierarchically,
 * root roles are placed on the leftmost column,
 * roles with the same superRole should be placed in the same column
 */

const RolesGraph = () => {
	const jwt = useAuthStore((state) => state.jwt);

	const rolesQuery = useQuery<MemberRole[], AxiosError>({
		queryKey: [RolesQK.GET_ALL_ROLES],
		queryFn: async () => {
			const roles = await getAllRoles(jwt);
			return roles;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	const nodeSize = { width: 200, height: 60 };
	const gap = { x: 400, y: 200 };
	const roleNodes = useMemo<RoleNode[]>(() => [], []);

	if (rolesQuery.isPending) {
		return <Loading />;
	}

	if (rolesQuery.isSuccess && rolesQuery.data) {
		/* helper function to recursively calculate positions */
		const calculateNodePosition = (
			role: MemberRole,
			x: number,
			y: number,
			columnMap: Map<string, number>
		): number => {
			/* check if the node is already placed */
			if (roleNodes.find((n) => n.id === role.id)) return x;

			/* find child roles */
			const childRoles = rolesQuery.data.filter(
				(r) => r.superRoleId === role.id
			);

			/* calculate the total width of the subtree */
			const subtreeWidth =
				childRoles.length > 0 ? (childRoles.length - 1) * gap.x : 0;

			/* calculate the starting x position for child nodes */
			let childX = x - subtreeWidth / 2;

			/* add the current node */
			roleNodes.push({
				id: role.id,
				position: { x, y },
				data: {
					label: role.name,
				},
				style: {
					width: nodeSize.width,
					height: nodeSize.height,
				},
			});

			/* place child roles in the next row */
			let maxX = x;
			for (const child of childRoles) {
				const newX = calculateNodePosition(
					child,
					childX,
					y + gap.y,
					columnMap
				);
				childX += gap.x;
				maxX = Math.max(maxX, newX);
			}

			return maxX;
		};

		/* start with root roles (superroleid: null) */
		const rootRoles = rolesQuery.data.filter((r) => r.superRoleId === null);
		let rootX = 0;
		let rootY = 0;
		for (const rootRole of rootRoles) {
			const subtreeWidth = calculateNodePosition(
				rootRole,
				rootX,
				rootY,
				new Map()
			);
			rootX +=
				subtreeWidth +
				gap.x; /* add horizontal space between root nodes */
		}

		const initialEdges = rolesQuery.data
			.filter((r) => r.superRoleId)
			.map((r) => ({
				id: `${r.id}-${r.superRoleId}`,
				source: r.superRoleId as string,
				target: r.id,
			}));
		return (
			<div
				className="w-full h-[50vh]
				overflow-x-auto"
			>
				<ReactFlow
					nodes={roleNodes}
					edges={initialEdges}
					colorMode={"dark"}
				>
					<Controls />
				</ReactFlow>
			</div>
		);
	} else {
		return <Exception />;
	}
};

export default RolesGraph;
