import { io, Socket } from "socket.io-client";

let retailSocket: Socket | null = null;

export const getRetailSocket = (): Socket => {
	if (!retailSocket) {
		/* initialize the retailSocket instance if it doesn't exist */
		retailSocket = io(`${process.env.NEXT_PUBLIC_API_HOST}/retail` || "", {
			autoConnect: true /* prevent auto-connect */,
		});
	}
	return retailSocket;
};
