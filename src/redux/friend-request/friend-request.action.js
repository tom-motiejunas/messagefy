import { FriendRequestTypes } from "./friend-request.types";

export const setFriendRequests = (request) => ({
  type: FriendRequestTypes.SET_FRIEND_REQUESTS,
  payload: request,
});
