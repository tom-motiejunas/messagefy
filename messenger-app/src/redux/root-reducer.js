import { combineReducers } from "redux";

import userReducer from "./user/user.reducer";
import friendRequestReducer from "./friend-request/friend-request.reducer";

const rootReducer = combineReducers({
  user: userReducer,
  friendRequests: friendRequestReducer,
});

export default rootReducer;
