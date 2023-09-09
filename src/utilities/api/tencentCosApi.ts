import COS from "cos-js-sdk-v5";

/**
 * Download avatar from tencent COS
 * @param tmpSecretId
 * @param tmpSecretKey
 * @param sessionToken
 * @param userId
 * @returns {Promise<Blob>} avatar
 */
export const downloadMyAvatar = async (
	tmpSecretId: string,
	tmpSecretKey: string,
	sessionToken: string,
	userId: string
): Promise<Blob> => {
	const cos = new COS({
		SecretId: tmpSecretId,
		SecretKey: tmpSecretKey,
		SecurityToken: sessionToken,
	});
	const objects = await cos.getBucket({
		Bucket: process.env.NEXT_PUBLIC_BUCKET as string,
		Region: process.env.NEXT_PUBLIC_REGION as string,
		Prefix: `app/avatar/${userId}/`,
	});
	if (objects.Contents === undefined) {
		throw new Error("No avatar found");
	}
	const keys = objects.Contents.map((content) => content.Key as string);
	const key = keys.find(
		(key) => key.endsWith(".jpg") || key.endsWith(".png")
	);
	if (key) {
		const cosRes = await cos.getObject({
			Bucket: process.env.NEXT_PUBLIC_BUCKET as string,
			Region: process.env.NEXT_PUBLIC_REGION as string,
			Key: key,
			DataType: "blob",
		});
		return cosRes.Body as Blob;
	} else {
		throw new Error("No avatar found");
	}
};

/**
 * Upload avatar to tencent COS
 * @param tmpSecretId
 * @param tmpSecretKey
 * @param sessionToken
 * @param file
 * @param userId
 */
export const uploadMyAvatar = async (
	tmpSecretId: string,
	tmpSecretKey: string,
	sessionToken: string,
	blob: Blob,
	userId: string
): Promise<any> => {
	const cos = new COS({
		SecretId: tmpSecretId,
		SecretKey: tmpSecretKey,
		SecurityToken: sessionToken,
	});
	const res = await cos.putObject({
		Bucket: process.env.NEXT_PUBLIC_BUCKET as string,
		Region: process.env.NEXT_PUBLIC_REGION as string,
		Key: `app/avatar/${userId}/avatar.png`,
		Body: blob,
	});
	return res;
};

/**
 * List avatars from tencent COS
 * @param tmpSecretId
 * @param tmpSecretKey
 * @param sessionToken
 * @param userId
 * @returns {Promise<string[]>} avatars
 */
export const listMyAvatars = async (
	tmpSecretId: string,
	tmpSecretKey: string,
	sessionToken: string,
	userId: string
): Promise<string[]> => {
	const cos = new COS({
		SecretId: tmpSecretId,
		SecretKey: tmpSecretKey,
		SecurityToken: sessionToken,
	});
	const cosRes = await cos.getBucket({
		Bucket: process.env.NEXT_PUBLIC_BUCKET as string,
		Region: process.env.NEXT_PUBLIC_REGION as string,
		Prefix: `app/avatar/${userId}/`,
	});
	const avatars = cosRes.Contents?.map((content) => content.Key as string);
	return avatars || [];
};

/**
 * Delete avatar from tencent COS
 * @param tmpSecretId
 * @param tmpSecretKey
 * @param sessionToken
 * @param key
 */
export const deleteMyAvatar = async (
	tmpSecretId: string,
	tmpSecretKey: string,
	sessionToken: string,
	key: string
): Promise<void> => {
	const cos = new COS({
		SecretId: tmpSecretId,
		SecretKey: tmpSecretKey,
		SecurityToken: sessionToken,
	});
	await cos.deleteObject({
		Bucket: process.env.NEXT_PUBLIC_BUCKET as string,
		Region: process.env.NEXT_PUBLIC_REGION as string,
		Key: key,
	});
};
