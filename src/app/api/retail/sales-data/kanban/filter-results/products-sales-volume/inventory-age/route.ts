import axios, { isAxiosError } from "axios";
import iconv from "iconv-lite";
import crypto from "crypto";

export async function POST(request: Request) {
	const { lstsku, warehouse_code } = await request.json();
	const body = {
		customer_code: "",
		lstsku: lstsku,
		warehouse_code: warehouse_code || "",
	};

	const params: {
		app_key: string | undefined;
		format: string;
		method: string;
		timestamp: number;
		v: string;
		sign?: string;
	} = {
		app_key: process.env.FOURPX_APP_KEY,
		format: "json",
		method: "fu.wms.inventory.getdetail",
		timestamp: Date.now(),
		v: "1.0.0",
	};

	const baseURL = "https://open.4px.com";

	/* build the full URL with query string */
	const qs = `${new URLSearchParams(params as any).toString()}`;
	/* remove '&' and '=' in qs, append stringified body */
	const qsForMd5 =
		qs.replace(/&/g, "").replace(/=/g, "") +
		JSON.stringify(body) +
		process.env.FOURPX_APP_SECRET;
	const hasher = crypto.createHash("md5");
	hasher.update(qsForMd5);
	const md5Hash = hasher.digest("hex");
	params.sign = md5Hash;
	const fullUrl = `${baseURL}/router/api/service?${qs}&sign=${md5Hash}`;

	try {
		const res = await axios.post(
			"/router/api/service",
			JSON.stringify(body),
			{
				baseURL,
				headers: {
					"Content-Type": "application/json",
				},
				params,
				responseType: "arraybuffer",
			}
		);
		const decoded = iconv.decode(Buffer.from(res.data), "gbk");
		/* pretty print the JSON response */
		return new Response(decoded, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
		});
	} catch (error) {
		if (isAxiosError(error)) {
			if (error.response) {
				console.error("Status:", error.response.status);
				console.error("Data:", error.response.data);
			} else if (error.request) {
				console.error("No response received:", error.request);
			}
		} else {
			console.error("Unexpected error:", error);
		}
	}
}
