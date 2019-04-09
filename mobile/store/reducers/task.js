import { FETCH_ALL_FAMILY_TASKS } from "../actions/actionTypes";
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
    default:
      return state;
  }
};

export default reducer;
