import { Dispatch, SetStateAction, createContext } from "react";

export type SaclStatusType =
	| "isSeededQuery.isLoading"
	| "isSeededQuery.isError"
	| "isSeededQuery.notSeeded"
	| "isSignedInQuery.isLoading"
	| "isSignedInQuery.isError"
	| "isSignedInQuery.unauthorized"
	| "isSignedInQuery.isSuccess"

type ContextType = {
	saclStatus: SaclStatusType;
	setSaclStatus: Dispatch<SetStateAction<SaclStatusType>> | (() => void);
};

export const SaclContext = createContext<ContextType>({
	saclStatus: "isSeededQuery.isLoading",
	setSaclStatus: () => null,
});
