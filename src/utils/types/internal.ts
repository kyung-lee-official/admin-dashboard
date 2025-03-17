import { z } from "zod";

export type MemberResponse = {
	id: string;
	email: string;
	name: string;
	isVerified: boolean;
};

export type Member = {
	id: string;
	email: string;
	name: string;
};

export type MemberRole = {
	id: string;
	name: string;
	superRole: MemberRole | null;
};

export const updateRoleByIdSchema = z.object({
	id: z.string(),
	name: z.string(),
	superRoleId: z.string().optional(),
	memberIds: z.array(z.string().uuid()),
});

export type UpdateRoleByIdDto = z.infer<typeof updateRoleByIdSchema>;

export type Log = {
	id: number;
	memberId: string;
	memberName: string;
	eventType: string;
	createdAt: string;
};
