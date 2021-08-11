import { createSelector } from "reselect";

const selectRequests = (state) => state.friendRequests;

export const selectFriendRequests = createSelector(
  [selectRequests],
  (request) => request.friendRequests
);
