import { combineReducers } from "redux";

import userReducer from "./user/user.reducer";
import friendRequestReducer from "./friend-request/friend-request.reducer";
import friendsReducer from "./friends/friend.reducer";
import groupsReducer from "./groups/groups.reducer";

const rootReducer = combineReducers({
  user: userReducer,
  friendRequests: friendRequestReducer,
  friends: friendsReducer,
  groups: groupsReducer,
});

export default rootReducer;
