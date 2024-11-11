import axios from "axios";

export const sendVerificationEmail = async (jwt: string) => {
	const res = await axios.post("/email/send-verification-email", null, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
		headers: {
			Authorization: jwt,
		},
	});
	return res.data;
};

export const verifyEmail = async (body: {
	verificationToken: string;
}): Promise<any> => {
	const res = await axios.post("/member-auth/verifyEmail", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};

export const changeEmail = async (newData: any, jwt: string): Promise<any> => {
	const res = await axios.patch(
		`/email/change-email`,
		{ newEmail: newData.email },
		{
			baseURL: process.env.NEXT_PUBLIC_API_HOST,
			headers: {
				Authorization: jwt,
			},
		}
	);
	return res.data;
};

export const verifyNewEmail = async (body: {
	verificationToken: string;
}): Promise<any> => {
	const res = await axios.patch("/email/verify-new-email", body, {
		baseURL: process.env.NEXT_PUBLIC_API_HOST,
	});
	return res.data;
};
