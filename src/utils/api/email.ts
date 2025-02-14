import axios from "axios";

export enum EmailQK {
	IS_NEW_EMAIL_VERIFIED = "is-new-email-verified",
}

export const sendVerificationEmail = async (jwt: string) => {
	const res = await axios.post("/email/send-verification-email", null, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const changeEmail = async (newData: any, jwt: string): Promise<any> => {
	const res = await axios.patch(
		`/email/change-email`,
		{ newEmail: newData.newEmail },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const verifyEmail = async (body: {
	verificationToken: string;
}): Promise<any> => {
	const res = await axios.patch("/email/verify-email", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};
