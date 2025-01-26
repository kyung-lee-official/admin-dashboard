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
	superRole?: MemberRole;
};
