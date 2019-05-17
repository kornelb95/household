import { UPDATE_ROOM, START_GAME } from "../actions/actionTypes";
const initialState = {
  roomMembers: [],
  isGame: false
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ROOM:
      return {
        ...state,
        roomMembers: action.room
      };
    case START_GAME:
      return {
        ...state,
        isGame: true
      };
    default:
      return state;
  }
};

export default reducer;
