import axios, { isAxiosError } from "axios";
import iconv from "iconv-lite";
import crypto from "crypto";

export async function POST(request: Request) {
	const { lstsku, warehouse_code } = await request.json();
	const body = {
		customer_code: "",
		lstsku: lstsku,
		warehouse_code: warehouse_code || "",
		page_no: 1,
		page_size: 10,
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
		method: "fu.wms.inventory.getlog",
		timestamp: Date.now(),
		v: "1.0.0",
		// app_secret: process.env.FOURPX_APP_SECRET,
	};

	const baseURL = "https://open.4px.com";

	/* build the full URL with query string */
	const qs = `${new URLSearchParams(params as any).toString()}`;
	// console.log("query string:", qs);
	/* remove '&' and '=' in qs, append stringified body */
	const qsForMd5 =
		qs.replace(/&/g, "").replace(/=/g, "") +
		JSON.stringify(body) +
		process.env.FOURPX_APP_SECRET;
	// console.log("query string for md5:", qsForMd5);
	const hasher = crypto.createHash("md5");
	hasher.update(qsForMd5);
	const md5Hash = hasher.digest("hex");
	// console.log("md5:", md5Hash);
	params.sign = md5Hash;
	const fullUrl = `${baseURL}/router/api/service?${qs}&sign=${md5Hash}`;
	// console.log("full URL:", fullUrl);

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
