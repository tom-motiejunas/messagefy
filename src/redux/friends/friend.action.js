import { FriendTypes } from "./friend.types";

export const setFriends = (friends) => ({
  type: FriendTypes.GET_FRIENDS,
  payload: friends,
});
