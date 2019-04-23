import { FETCH_ALL_FAMILY_TASKS, DELETE_TASK } from "../actions/actionTypes";
const initialState = {
  tasks: []
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_FAMILY_TASKS:
      return {
        ...state,
        tasks: [...action.tasks]
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.taskID)
      };
    default:
      return state;
  }
};

export default reducer;
