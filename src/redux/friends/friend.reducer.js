import { FriendTypes } from "./friend.types";

const INITIAL_STATE = {
  friends: null,
};

const friendsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FriendTypes.GET_FRIENDS:
      return {
        ...state,
        friends: action.payload,
      };
    default:
      return state;
  }
};

export default friendsReducer;
