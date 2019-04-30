import {
  FETCH_ALL_FAMILY_TASKS,
  DELETE_TASK,
  TO_ACCEPT_TASK,
  ACCEPT_TASK
} from "../actions/actionTypes";
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
    case TO_ACCEPT_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => {
          return task._id === action.taskID
            ? { ...task, toAccept: true }
            : task;
        })
      };
    case ACCEPT_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => {
          return task._id === action.task._id
            ? { ...task, finished: true, accepted: action.task.accepted }
            : task;
        })
      };
    default:
      return state;
  }
};

export default reducer;
