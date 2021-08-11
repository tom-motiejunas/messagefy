import { createSelector } from "reselect";

const selectFriendList = (state) => state.friends;

export const selectFriends = createSelector(
  [selectFriendList],
  (friends) => friends.friends
);
