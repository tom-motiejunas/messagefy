import { createSelector } from "reselect";

const selectGroupList = (state) => state.groups;

export const selectGroups = createSelector(
  [selectGroupList],
  (groups) => groups.groups
);
