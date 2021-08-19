import { GroupTypes } from "./groups.types";

export const setGroups = (groups) => ({
  type: GroupTypes.GET_GROUPS,
  payload: groups,
});
