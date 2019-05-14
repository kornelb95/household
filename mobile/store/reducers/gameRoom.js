import { UPDATE_ROOM } from "../actions/actionTypes";
const initialState = {
  roomMembers: []
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ROOM:
      return {
        ...state,
        roomMembers: action.room
      };
    default:
      return state;
  }
};

export default reducer;
