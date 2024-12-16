export type Member = {
	id: string;
	email: string;
	name: string;
};

export type MemberRole = {
	id: string;
	name: string;
	superRoleId?: string;
};
