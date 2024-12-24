import { EditSectionData } from "@/utils/types/app/performance";
import { nanoid } from "nanoid";

export enum EditSectionType {
	INITIALIZE = "initialize",
	CREATE = "create",
	UPDATE_TITLE = "update-title",
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
			return state.concat({
				tempId: nanoid(),
				weight: 0,
				title: "New Section",
				description: "",
			});
		}
		case EditSectionType.UPDATE_TITLE: {
			const { tempId, title } = action.payload;
			return state.map((s) => {
				if (s.tempId === tempId) {
					return {
						id: s.id,
						tempId: s.tempId,
						weight: s.weight,
						title: title,
						description: s.description,
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
						title: s.title,
						description: s.description,
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
						title: s.title,
						description: description,
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
