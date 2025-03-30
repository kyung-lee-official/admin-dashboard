import { EditSectionData } from "@/utils/types/app/performance";
import { nanoid } from "nanoid";

export enum EditSectionType {
	INITIALIZE = "initialize",
	CREATE = "create",
	UPDATE_TITLE = "update-title",
	UPDATE_MEMBER_ROLE = "update-member-role",
	UPDATE_WEIGHT = "update-weight",
	UPDATE_DESCRIPTION = "update-description",
	DELETE = "delete",
}

export type EditSectionAction = {
	type: EditSectionType;
	payload?: any;
};

export function statSectionsReducer(
	state: EditSectionData[],
	action: EditSectionAction
) {
	switch (action.type) {
		case EditSectionType.INITIALIZE: {
			return action.payload;
		}
		case EditSectionType.CREATE: {
			const newState = state.concat({
				tempId: nanoid(),
				weight: 0,
				memberRoleId: null,
				title: "New Section",
				description: "",
				createdAt: new Date().toISOString(),
			});
			return newState;
		}
		case EditSectionType.UPDATE_TITLE: {
			const { tempId, title } = action.payload;
			return state.map((s) => {
				if (s.tempId === tempId) {
					return {
						id: s.id,
						tempId: s.tempId,
						weight: s.weight,
						memberRoleId: s.memberRoleId,
						title: title,
						description: s.description,
						createdAt: s.createdAt,
					};
				}
				return s;
			});
		}
		case EditSectionType.UPDATE_WEIGHT: {
			const { tempId, weight } = action.payload;
			return state.map((s) => {
				if (s.tempId === tempId) {
					return {
						id: s.id,
						tempId: s.tempId,
						weight: weight,
						memberRoleId: s.memberRoleId,
						title: s.title,
						description: s.description,
						createdAt: s.createdAt,
					};
				}
				return s;
			});
		}
		case EditSectionType.UPDATE_MEMBER_ROLE: {
			const { tempId, memberRoleId } = action.payload;
			return state.map((s) => {
				if (s.tempId === tempId) {
					return {
						id: s.id,
						tempId: s.tempId,
						weight: s.weight,
						memberRoleId: memberRoleId,
						title: s.title,
						description: s.description,
						createdAt: s.createdAt,
					};
				}
				return s;
			});
		}
		case EditSectionType.UPDATE_DESCRIPTION: {
			const { tempId, description } = action.payload;
			return state.map((s) => {
				if (s.tempId === tempId) {
					return {
						id: s.id,
						tempId: s.tempId,
						weight: s.weight,
						memberRoleId: s.memberRoleId,
						title: s.title,
						description: description,
						createdAt: s.createdAt,
					};
				}
				return s;
			});
		}
		case EditSectionType.DELETE: {
			const { tempId } = action.payload;
			return state.filter((s) => s.tempId !== tempId);
		}
		default: {
			return state;
		}
	}
}
