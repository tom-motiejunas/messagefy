import { GroupTypes } from "./groups.types";

const INITIAL_STATE = {
  groups: null,
};

const groupsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GroupTypes.GET_GROUPS:
      return {
        ...state,
        groups: action.payload,
      };
    default:
      return state;
  }
};

export default groupsReducer