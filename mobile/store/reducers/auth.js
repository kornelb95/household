import { AUTH_ERROR, LOGIN } from "../actions/actionTypes";
const initialState = {
  error: "",
  loggedUser: ""
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_ERROR:
      return {
        ...state,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggedUser: action.user
      };
    default:
      return state;
  }
};

export default reducer;
