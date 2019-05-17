import {
  UPDATE_ROOM,
  START_GAME,
  REMIS,
  RESOLVED
} from "../actions/actionTypes";
const initialState = {
  roomMembers: [],
  isGame: false,
  action: ""
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
    case REMIS:
      return {
        ...state,
        action: "REMIS"
      };
    case RESOLVED:
      return {
        ...state,
        action: `WYGRAŁ ${action.payload.winner.user.name}`,
        roomMembers: [action.payload.winner, action.payload.looser]
      };
    default:
      return state;
  }
};

export default reducer;
