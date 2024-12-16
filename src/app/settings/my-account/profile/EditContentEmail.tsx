import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button/Button";
import { getMyInfo, MembersQK } from "@/utils/api/members";
import { changeEmail, sendVerificationEmail } from "@/utils/api/email";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { MyInfo } from "./Content";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";

export const EditContentEmail = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.EMAIL;
	const title = "Edit Email";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);
	const setJwt = useAuthStore((state) => state.setJwt);

	const [oldData, setOldData] = useState<MyInfo>({
		id: "",
		email: "",
		name: "",
		isVerified: false,
		isFrozen: false,
		createdAt: "",
		updatedAt: "",
		memberRoles: [],
	});
	const [newData, setNewData] = useState<MyInfo>(oldData);

	const myInfoQuery = useQuery<MyInfo, AxiosError>({
		queryKey: [MembersQK.GET_MY_INFO, jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		if (myInfoQuery.isSuccess) {
			setNewData(myInfoQuery.data);
		}
	}, [myInfoQuery.data]);

	const mutation = useMutation({
		mutationFn: () => {
			return changeEmail(newData, jwt);
		},
		onSuccess: (data) => {
			setJwt(data.jwt);
			queryClient.invalidateQueries({
				queryKey: [MembersQK.GET_MY_INFO, data.jwt],
			});
			setEdit({ show: false, id: editId });
		},
	});

	function onSave() {
		mutation.mutate();
	}

	/* email verification */

	const [emailSent, setEmailSent] = useState<boolean>(false);
	const [allowResendTimestamp, setAllowResendTimestamp] = useState<number>(0);
	const [now, setNow] = useState<number>(Date.now());

	/* send manually */

	const sendEmailMutation = useMutation({
		mutationKey: ["send-verification-email", jwt],
		mutationFn: sendVerificationEmail,
		onSuccess: () => {
			setEmailSent(true);
			setAllowResendTimestamp(Date.now() + 20000);
		},
	});

	if (myInfoQuery.data) {
		return (
			<EditContentRegular
				title={title}
				editId={editId}
				edit={edit}
				setEdit={setEdit}
				onSave={onSave}
				newData={newData}
				oldData={oldData}
			>
				<form
					action={onSave}
					className="flex-[1_0_100px] flex flex-col"
				>
					<div className="flex-[1_0_100px] flex flex-col px-6 py-4 gap-6">
						<div
							className="flex flex-col gap-1.5
							text-sm"
						>
							Email
							<input
								type="text"
								className="px-2 py-1.5
								bg-white/10
								rounded-md outline-none
								border-[1px] border-white/10"
								value={newData.email}
								onChange={(e) => {
									setNewData({
										...newData,
										email: e.target.value,
									});
								}}
							/>
						</div>
						{!myInfoQuery.data.isVerified && (
							<div
								className="flex flex-col gap-1.5
								text-sm"
							>
								<Button
									size="sm"
									onClick={(e) => {
										e.preventDefault();
										sendEmailMutation.mutate(jwt);
									}}
								>
									Send verification email
								</Button>
							</div>
						)}
					</div>
				</form>
			</EditContentRegular>
		);
	}
};
