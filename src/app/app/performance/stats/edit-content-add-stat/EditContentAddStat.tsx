import { Button } from "@/components/button/Button";
import { EditProps } from "@/components/edit-panel/EditPanel";
import { UnsavedDialog } from "@/components/edit-panel/UnsavedDialog";
import { CloseIcon } from "@/components/icons/Icons";
import { useAuthStore } from "@/stores/auth";
import { createStat, PerformanceQK } from "@/utils/api/app/performance";
import { queryClient } from "@/utils/react-query/react-query";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { MemberSelector } from "./MemberSelector";
import { MonthPicker } from "@/components/date/date-picker/month-picker/MonthPicker";
import { Member } from "@/utils/types/internal";
import { Sections } from "./Sections";
import {
	CreatePerformanceStatData,
	CreateSectionData,
} from "@/utils/types/app/performance";

export const EditContentAddStat = (props: {
	edit: EditProps;
	setEdit: Dispatch<SetStateAction<EditProps>>;
}) => {
	const editId = "add-stat";
	const { edit, setEdit } = props;

	const listenerRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	const jwt = useAuthStore((state) => state.jwt);

	const curr = dayjs();

	const oldData: CreatePerformanceStatData = useMemo(
		() => ({
			ownerId: "",
			month: curr.toDate(),
			statSections: [
				{
					weight: 100,
					title: "New Section",
					description: "",
				},
			],
		}),
		[]
	);

	const [newData, setNewData] = useState<CreatePerformanceStatData>(oldData);

	const [isChanged, setIsChanged] = useState(false);
	const isChangedRef = useRef(isChanged);
	const _setIsChanged = (data: any) => {
		isChangedRef.current = data;
		setIsChanged(data);
	};
	const [showUnsaved, setShowUnsaved] = useState(false);

	const mutation = useMutation({
		mutationFn: () => {
			return createStat(newData, jwt);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [PerformanceQK.GET_PERFORMANCE_STATS, jwt],
			});
			setIsChanged(false);
			setEdit({ show: false, id: editId });
		},
		onError: () => {},
	});

	function onSave() {
		mutation.mutate();
	}

	useEffect(() => {
		if (newData && JSON.stringify(newData) !== JSON.stringify(oldData)) {
			_setIsChanged(true);
		} else {
			_setIsChanged(false);
		}
	}, [newData]);

	function quit() {
		if (isChangedRef.current) {
			setShowUnsaved(true);
		} else {
			setEdit({ show: false, id: editId });
		}
	}

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (!listenerRef.current) {
				return;
			}
			if (listenerRef.current === event.target) {
				quit();
			}
		}
		listenerRef.current?.addEventListener("click", handleClickOutside);
		return () => {
			listenerRef.current?.removeEventListener(
				"click",
				handleClickOutside
			);
		};
	}, [isChanged]);

	const [member, setMember] = useState<Member>();
	const [month, setMonth] = useState<dayjs.Dayjs>(curr);
	const [sections, setSections] = useState<CreateSectionData[]>(
		newData.statSections
	);
	useEffect(() => {
		setNewData({
			ownerId: member?.id ?? "",
			month: month.toDate(),
			statSections: sections,
		});
	}, [member, month, sections]);

	return (
		<div
			ref={listenerRef}
			className="w-full h-svh
			flex justify-end items-center"
		>
			<motion.div
				ref={panelRef}
				initial={{ x: "100%" }}
				animate={{ x: "0%" }}
				transition={{ duration: 0.1 }}
				className="flex flex-col h-[calc(100svh-16px)] w-full max-w-[560px] m-2
				text-white/90
				bg-neutral-900
				rounded-lg border-[1px] border-neutral-700 border-t-neutral-600"
			>
				<div
					className="flex-[0_0_61px] flex justify-between px-6 py-4
					font-semibold text-lg
					border-b-[1px] border-white/10"
				>
					<div>Add Stat</div>
					<button
						className="flex justify-center items-center w-7 h-7
						text-white/50
						hover:bg-white/10 rounded-md"
						onClick={() => {
							quit();
						}}
					>
						<CloseIcon size={15} />
					</button>
				</div>
				<form
					action={onSave}
					className="flex-[1_0_100px] flex flex-col"
				>
					<div
						className="flex-[1_0_100px] flex flex-col px-6 py-4 gap-6
						border-b-[1px] border-white/10"
					>
						<div
							className="flex flex-col gap-1.5
							text-sm"
						>
							Member
							<MemberSelector
								member={member}
								setMember={setMember}
							/>
						</div>
						<div
							className="flex flex-col gap-1.5
							text-sm"
						>
							Month
							<MonthPicker date={month} setDate={setMonth} />
						</div>
						<div
							className="flex flex-col gap-1.5
							text-sm"
						>
							<Sections
								sections={sections}
								setSections={setSections}
							/>
						</div>
					</div>
					<div className="flex-[0_0_61px] flex justify-end px-6 py-4 gap-1.5">
						<Button
							color="cancel"
							size="sm"
							onClick={(e) => {
								e.preventDefault();
								quit();
							}}
						>
							Cancel
						</Button>
						<Button type="submit" size="sm">
							Save
						</Button>
					</div>
				</form>
				<UnsavedDialog
					edit={edit}
					setEdit={setEdit}
					showUnsaved={showUnsaved}
					setShowUnsaved={setShowUnsaved}
				/>
			</motion.div>
		</div>
	);
};
