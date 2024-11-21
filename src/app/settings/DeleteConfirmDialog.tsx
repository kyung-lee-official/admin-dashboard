import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/button/Button";
import { useMutation } from "@tanstack/react-query";
import { deleteRoleById } from "@/utils/api/roles";
import { queryClient } from "@/utils/react-query/react-query";
import { useAuthStore } from "@/stores/auth";

export const DeleteConfirmDialog = (props: {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
	roleId: string;
}) => {
	const { show, setShow, roleId } = props;
	const { jwt } = useAuthStore();

	const mutation = useMutation({
		mutationFn: () => {
			return deleteRoleById(roleId, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get-roles", jwt],
			});
			setShow(false);
		},
		onError: () => {},
	});

	function onDelete() {
		mutation.mutate();
	}

	if (show) {
		return (
			<div
				className="fixed top-0 right-0 bottom-0 left-0
				bg-black/50 flex justify-center items-center
				z-30"
			>
				<div
					className="w-full max-w-[400px] mx-auto
					text-white/90
					bg-neutral-800
					border-[1px] border-white/10
					shadow-lg rounded-md backdrop:bg-black/50 outline-none"
				>
					<div className="flex flex-col pt-6 px-6 gap-1.5">
						<div className="font-semibold">
							Are you sure you want to delete this role?
						</div>
						<div className="text-sm text-white/50">
							Members that only belong to this role will be moved
							to 'default' role.
						</div>
					</div>
					<div
						className="flex justify-end p-6 gap-1.5
						leading-4"
					>
						<Button
							color="cancel"
							size="sm"
							onClick={() => {
								setShow(false);
							}}
						>
							Cancel
						</Button>
						<Button size="sm" onClick={onDelete}>
							Confirm
						</Button>
					</div>
				</div>
			</div>
		);
	} else {
		return null;
	}
};
