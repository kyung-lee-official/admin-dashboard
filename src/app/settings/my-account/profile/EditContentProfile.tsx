import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getMyInfo, MembersQK, updateProfile } from "@/utils/api/members";
import { EditId, EditProps } from "@/components/edit-panel/EditPanel";
import { MyInfo } from "./Content";
import { EditContentRegular } from "@/components/edit-panel/EditContentRegular";

export const EditContentProfile = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = EditId.PROFILE;
	const title = "Edit Profile";
	const { edit, setEdit } = props;

	const jwt = useAuthStore((state) => state.jwt);

	const myInfoQuery = useQuery<MyInfo, AxiosError>({
		queryKey: [MembersQK.GET_MY_INFO, jwt],
		queryFn: async () => {
			const isSignedIn = await getMyInfo(jwt);
			return isSignedIn;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});

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

	useEffect(() => {
		if (myInfoQuery.isSuccess) {
			setNewData(myInfoQuery.data);
		}
	}, [myInfoQuery.data]);

	const mutation = useMutation({
		mutationFn: () => {
			return updateProfile(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [MembersQK.GET_MY_INFO, jwt],
			});
			setEdit({ show: false, id: editId });
		},
		onError: () => {},
	});

	function onSave() {
		mutation.mutate();
	}

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
			<form action={onSave} className="flex-[1_0_100px] flex flex-col">
				<div className="flex-[1_0_100px] flex flex-col px-6 py-4">
					<div
						className="flex flex-col gap-1.5
						text-sm"
					>
						Name
						<input
							type="text"
							className="px-2 py-1.5
							bg-white/10
							rounded-md outline-none
							border-[1px] border-white/10"
							value={newData.name}
							onChange={(e) => {
								setNewData({
									...newData,
									name: e.target.value,
								});
							}}
						/>
					</div>
				</div>
			</form>
		</EditContentRegular>
	);
};
