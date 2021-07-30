import { FriendRequestTypes } from "./friend-request.types";

const INITIAL_STATE = {
  friendRequests: null,
};

const friendRequestReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FriendRequestTypes.SET_FRIEND_REQUESTS:
      return {
        ...state,
        friendRequests: action.payload,
      };
    default:
      return state;
  }
};

export default friendRequestReducer;
