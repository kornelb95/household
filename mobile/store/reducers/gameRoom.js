import {
  UPDATE_ROOM,
  START_GAME,
  REMIS,
  RESOLVED,
  GAME_OVER,
  CLEAR_GAMEROOM,
  CHOOSE_TASK_FOR_GAME
} from "../actions/actionTypes";
import { bookTask } from "../actions/tasks";
const initialState = {
  roomMembers: [],
  isGame: false,
  action: "",
  task: {}
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
        action: "REMIS",
        roomMembers: [action.payload.user1, action.payload.user2]
      };
    case RESOLVED:
      return {
        ...state,
        action: `WYGRAŁ ${action.payload.winner.user.name}`,
        roomMembers: [action.payload.winner, action.payload.looser]
      };
    case GAME_OVER:
      bookTask(state.task._id, action.payload.user.userId);
      return {
        ...state,
        action: `ROZGRYWKĘ WYGRYWA ${action.payload.user.name}`,
        isGame: false
      };
    case CLEAR_GAMEROOM:
      return {
        ...state,
        roomMembers: state.roomMembers.map(el => {
          return { ...el, points: 0 };
        }),
        task: {}
      };
    case CHOOSE_TASK_FOR_GAME:
      return {
        ...state,
        task: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
